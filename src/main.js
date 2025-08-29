import { mount } from 'svelte'
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('app'),
})

export default app


export function format_book_tx(book_tx) {
  let book_data = {}
    book_data.id = book_tx.id
    for (let t of book_tx.tags) {
      book_data[t.name] = t.value
    }
    return book_data
  
}

export async function search_books_graphql(q, search_tag, mime_type, language) {
  const graphql_query = `{ 
    transactions(
        tags: [
          { name: "App-Name", values: ["Libgen"] },
          { name: "${search_tag}", values: ["*${q}*"], match : WILDCARD },
          { name: "Content-Type", values: ["*${mime_type}*"], match : WILDCARD},
        ],
        first: 50 
      ) {
        edges {
          node {
            id
            tags {
              name
              value
            }
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }`;

  console.log(graphql_query)

  // Execute the query
  const res = await fetch('https://arweave-search.goldsky.com//graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: graphql_query })
  });

  const resp = await res.json()
  console.log(resp)
  return resp.data.transactions.edges.map( (e) => format_book_tx(e.node))
}

import { dryrun } from '@permaweb/aoconnect'
export const process_id = 'mI_boPd9ysI1IUQkmj93u2LohrSScBQoOsyp-bZlyfQ'
export async function search_books_ao(q, search_tag, mime_type, language) {
    
    console.log('sending search dryrun : ', q, mime_type)

    const filters = {}
    if (mime_type) filters['Content-Type'] = mime_type
    if (language) filters['Language'] = language
    
    const resp = await dryrun({
      process: process_id,
      tags: [
        { name: 'Action', value: 'Search_document' }
      ],
      data: JSON.stringify({query : q, filters : filters}),
    });

    const result = JSON.parse(resp.Messages[0].Data)
    console.log('ao-search results : ', result)
    const search_results = result.map(x => {x.metadata['id'] = x.id; return x.metadata})

    return search_results

}

export async function get_random_docs(n) {
    
    const seed = Math.floor(Math.random() * 1000)
    console.log(' random seed : ', seed)
    const random_doc_resp = await dryrun({
       process: process_id,
       tags: [
         { name: 'Action', value: 'Get_random_documents' }
       ],
       data: JSON.stringify({seed : seed, n : n }),
    });

    console.log(random_doc_resp)
    console.log(JSON.stringify(random_doc_resp, null, 2))
    const random_doc_result = JSON.parse(random_doc_resp.Messages[0].Data)
    console.log(random_doc_result)
    const book_results = random_doc_result.map(x => {x.metadata['id'] = x.id; return x.metadata})
    return book_results
}