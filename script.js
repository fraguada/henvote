// documentation for octokit: https://octokit.github.io/rest.js/v18
import { Octokit } from 'https://cdn.skypack.dev/@octokit/rest'

//currently not authenticated
const octokit = new Octokit();

const loginbtn = document.getElementById( 'loginbtn' )
loginbtn.onclick = () => {

    window.location.href = 'https://github.com/login/oauth/authorize?client_id=21066815541aa6f53c67&redirect_uri=https%3A%2F%2Ffraguada.github.io%2Fhenvote%2F'

}

function vote () {
    console.log( 'vote!' )
}

(async () => {

    const data = await getIssuesData()
    console.log(data)

    for ( let i = 0; i < data.length; i ++ ) {

        const d = data[ i ]

        const el = document.createElement( 'div' )
        const a = document.createElement( 'a' )
        const div = document.createElement( 'div' )
        const hr = document.createElement( 'hr' )
        const btn = document.createElement( 'button' )
        a.href = d.url
        a.innerText = ' #' + d.number + ': ' + d.title
        div.innerText = 'votes: ' + d.votes + ' |'
        div.style.display = 'inline-block'
        btn.id = 'votebtn'
        btn.onclick = vote()
        btn.innerText = 'vote'
        el.appendChild( btn )
        el.appendChild( div )
        el.appendChild( a )
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
        per_page: 30
    } )

    return response
}

async function getIssueReactions ( issueId ) {

    const response = await octokit.rest.reactions.listForIssue({
        owner: 'hicetnunc2000',
        repo: 'hicetnunc',
        issue_number: issueId,
    })

    return response

}
