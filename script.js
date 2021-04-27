import { Octokit } from 'https://cdn.skypack.dev/@octokit/rest'

const octokit = new Octokit()

getit()

async function getit() {

    const response = await octokit.rest.issues.listForRepo({
        owner: 'hicetnunc2000',
        repo: 'hicetnunc',
      })

    console.log( response )

    for( let i = 0; i < response.data.length; i++ ) {

        let issue = response.data[ i ]
        var el = document.createElement( 'div' )
        el.innerText = issue.title
        document.body.appendChild( el )

    }
}