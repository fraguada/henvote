import { Octokit } from 'https://cdn.skypack.dev/@octokit/core'
console.log( 'hi' )

const octokit = new Octokit()

getit()

async function getit() {

    const response = await octokit.request("GET /orgs/{org}/repos", {
        org: "hicetnunc2000",
        type: "public",
    })

    console.log( response )
}