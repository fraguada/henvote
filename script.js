// documentation for octokit: https://octokit.github.io/rest.js/v18
import { Octokit } from 'https://cdn.skypack.dev/@octokit/rest'
import { createAppAuth } from 'https://cdn.skypack.dev/@octokit/auth-app'

//currently not authenticated
let octokit = new Octokit();

/*

let userId = null

getUser()


function getUser() {

    const here = window.location.href
    const params = new URLSearchParams( here.substring( here.indexOf( '?' ) ) )

    if ( params.has( 'code' ) && params.has( 'state' ) ) {

        const state = params.get( 'state' )

        if ( state === localStorage[ 'state' ] ) {

            userId = params.get( 'code' )





        }

    }
}

const loginbtn = document.getElementById( 'loginbtn' )

if ( userId !== null ) {

    loginbtn.disabled = true
}

loginbtn.onclick = () => {

    const state = uuidv4()

    localStorage.setItem('state', state)

    window.location.href = 'https://github.com/login/oauth/authorize?client_id=21066815541aa6f53c67&redirect_uri=https%3A%2F%2Ffraguada.github.io%2Fhenvote%2F&state=' + state

}

function vote () {
    console.log( 'vote!' )
    // TODO: https://docs.github.com/en/developers/apps/identifying-and-authorizing-users-for-github-apps
}


*/
(async () => {

    const data = await getIssuesData()
    console.log(data)

    for ( let i = 0; i < data.length; i ++ ) {

        const d = data[ i ]

        const el = document.createElement( 'div' )
        const a = document.createElement( 'a' )
        const div = document.createElement( 'div' )
        const hr = document.createElement( 'hr' )
        //const content = document.createElement( 'div' )
        // const btn = document.createElement( 'button' )
        a.href = d.url
        a.innerText = ' #' + d.number + ': ' + d.title
        //a.style.fontWeight='bold'
        div.innerText = '+' + d.votes + ' |'
        div.style.display = 'inline-block'
        //div.style.fontWeight='bold'
        //content.innerText = d.content
        /*
        btn.id = 'votebtn'
        btn.onclick = vote
        btn.innerText = 'vote'
        btn.disabled = ( userId === null ) ? true : false
        */
        // el.appendChild( btn )
        el.appendChild( div )
        el.appendChild( a )
        //el.appendChild( content )
        el.style.display = 'inline-block'
        document.body.appendChild( el )
        document.body.appendChild( hr )

    }

    document.getElementById('loader').remove()

})().catch(e => {
    // do something with errors
    console.log( e )
});

async function getIssuesData() {

    const d = []

    const issues = await getIssues()

    console.log( issues )

    for( let i = 0; i < issues.data.length; i++ ) {

        const issue = issues.data[ i ]

        //console.log( issue )

        // skip pull requests if they are labeled 'feature-request'
        // we could add associated PRs later if relevant
        if ( issue.hasOwnProperty( 'pull_request' ) ) continue

        const reactions = await getIssueReactions( issue.number )

        let votes = 0

        if ( reactions.data.length > 0 ) {

            for( let j = 0; j < reactions.data.length; j++ ) {

                const reaction = reactions.data[ j ]

                if ( reaction.content === '+1' ) {

                    votes ++

                }

            }

        }

        const issueData = {
            number: issue.number,
            title: issue.title,
            content: issue.body.substring( 0, 240 ) + '...',
            url: issue.html_url,
            votes: votes
        }

        //console.log( d )
        d.push( issueData )
        
    }

    //sort
    d.sort((a, b) => (a.votes > b.votes) ? -1 : 1)
    return d

}

async function getIssues() {

    const response = await octokit.rest.issues.listForRepo({
        owner: 'hicetnunc2000',
        repo: 'hicetnunc',
        state: 'open',
        labels: 'feature-request',
        per_page: 30,
        direction: 'asc'
    } )

    return response
}

async function getIssueReactions ( issueId ) {

    const response = await octokit.rest.reactions.listForIssue({
        owner: 'hicetnunc2000',
        repo: 'hicetnunc',
        issue_number: issueId,
    })

    console.log( response )

    return response

}

// from https://stackoverflow.com/a/2117523/2179399
function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}
