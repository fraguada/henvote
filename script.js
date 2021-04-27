import { Octokit } from 'https://cdn.skypack.dev/@octokit/rest'

const octokit = new Octokit()

getit()

async function getit() {

    const response = await octokit.rest.issues.listForRepo({
        owner: 'hicetnunc2000',
        repo: 'hicetnunc',
      })

    console.log( response )
}