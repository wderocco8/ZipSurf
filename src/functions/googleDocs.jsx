import { gapi } from 'gapi-script'

/* EXPORTING URLS USING GOOGLE DOCS API  */
const handleExportURLs = async (allURLs) => {
    try {
        // check if user is signed in
        const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get()
        if (!isSignedIn) {
            try {
                await handleSignIn()
            } catch (error) {
                console.log("Error authenticating with google:", error)
            }
        }
        
        await exportURLs(allURLs)
    } catch (error) {
        console.log("Error exporting URLs:", error)
    }
}

// export arrow function to use in Navbar
export default handleExportURLs

const handleSignIn = async () => {
    try {
        await gapi.auth2.getAuthInstance().signIn() 
    } catch (error) {
        console.log("Error signing in", error)
    }
}

function zerofill(i) {
    return (i < 10 ? '0' : '') + i
}

function getDateString() {
    const date = new Date
    const year = date.getFullYear()
    const month = zerofill(date.getMonth() + 1)
    const day = zerofill(date.getDate())
    return month + '/' + day + '/' + year
}

function getTimeString() {
    const date = new Date()
    return date.toLocaleTimeString()
}

// google docs API functions
const exportURLs = async (allURLs) => {
    // map urls to a list of their tinyURLs
    const tinyURLs = allURLs.map(url => url.tiny_url)
    console.log(tinyURLs)

    try {
        console.log(allURLs)
        // get current date
        const date = getDateString()
        const time = getTimeString()

        // define filename
        const filename = `ZipSurf URL Collection -- ${date} ${time}`
        const requestBody = {
            title: filename, // Replace 'filename' with the desired title for your Google Doc
        }

        // obtain user's access token (2 methods -- both work)
        // const accessToken = userResult.getAuthResponse().access_token // this requires getting user first
        const accessToken = gapi.auth.getToken().access_token
        console.log(accessToken)

        // API 1: use user accessToken (createDoc)
        const response = await fetch('https://docs.googleapis.com/v1/documents', {
            method: 'POST',
            headers: new Headers({ 
                'Authorization': `Bearer ${accessToken}`, 
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify(requestBody)
        })

        const data = await response.json()
        console.log('Google doc created:', data)

        // extract document id
        const documentId = data.documentId

        // API 2: insert content into new doc (batchUpdate)
        const contentrequestBody = {
            // map each url to a new line using `insertText`
            requests: tinyURLs.reverse().map((tinyURL, index) => {
              return [
                {insertText: {
                    text: `${tinyURL.trim()}\n\n`,
                    location: {
                    index: 1,
                    },
                }},
                { updateTextStyle: {
                    textStyle: {
                        link: {
                            url: tinyURL,
                        }
                    },
                    range: {
                        startIndex: 1,
                        endIndex: tinyURL.length + 1,
                    },
                    fields: 'link',
                }}
                ]
            })
          }
                 
        const insertResponse = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
            method: 'POST',
            headers: new Headers({ 
                'Authorization': `Bearer ${accessToken}`, 
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify(contentrequestBody)
        })

        const insertData = await insertResponse.json()
        console.log("Content inserted into the document:", insertData)

        window.open("https://docs.google.com/document/d/" + data.documentId + "/edit", "_blank", "noopener noreferrer")
    }
    catch (error) {
        console.log('Error creating Google doc', error)
    }
}