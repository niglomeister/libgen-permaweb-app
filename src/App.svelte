<script>
  import { onMount } from "svelte";

const formatToMimeType = {
  "epub": "application/epub+zip",
  "mobi": "application/x-mobipocket-ebook",
  "azw": "application/vnd.amazon.ebook",
  "azw3": "application/vnd.amazon.mobi8-ebook",
  "fb2": "application/x-fictionbook+xml",
  "pdf": "application/pdf",
  "rtf": "application/rtf",
  "txt": "text/plain"
};

const criteria_to_tag = {
  'title' : 'Title',
  'authors' : 'Author',
  'series' : 'Series'
}

let q = ''
let criteria = 'title'
let format = ''
let language = ''
const update = async () => {
        const params = new URLSearchParams(window.location.search)
        q = params.get('q') || ""
        criteria = params.get('criteria') || 'title'
        format = params.get('format') || ''
        language = params.get('language') || ''

        if (!params.size) return

        await search_books()
}
onMount(update)

let results = []
async function search_books() {
  //e.preventDefault()
  const search_tag = criteria_to_tag[criteria]
  const mime_type = formatToMimeType[format] || ""

  const graphql_query = `{ 
    transactions(
        tags: [
          { name: "App-Name", values: ["Libgen"] },
          { name: "${search_tag}", values: ["*${q}*"], match : WILDCARD },
          { name: "Content-Type", values: ["${mime_type}"]},
        ],
        first: 100 
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

  console.log(resp.data.transactions.edges)
  const t = []
  for ( const r of resp.data.transactions.edges) {
    let h = {}
    h.txid = r.node.id
    for (let t of r.node.tags) {
      h[t.name] = t.value
    }
    t.push(h)
  }
  results = t
  
}
</script>

<main>
  <ul id="menu">
    <li><div class="drop">Download</div>
      <div class="dropdown_2columns">
        <div class="col_2">
          <ul>
            <li><a href="https://libgen.is/dbdumps/">Database dumps (library's catalogue)</a></li>
            <li><a href="https://libgen.is/fiction/repository_torrent/">Torrents (library's content)</a></li>
            <li><a href="https://phillm.net/libgen-stats-table.php">Torrent health tracker</a></li>
          </ul>
        </div>
      </div>
    </li>
    <li><a class="drop" href="https://wiki.mhut.org/content:how_to_upload">Upload</a>
      <div class="dropdown_2columns">
        <div class="col_2">
          <div><a href="https://library.bz/fiction/upload/">Web uploader</a></div>
          <div style="margin:0 0 1em 0">for an anonymous access use<br>username: <em>genesis</em><br>password: <em>upload</em></div>
          <div><a href="https://wiki.mhut.org/content:how_to_upload">A quick guide on how to upload</a></div>
        </div>
      </div>
    </li>
    <li><div class="drop">Updates</div>
      <div class="dropdown_2columns">
        <div class="col_2">
          <ul>
            <li><a href="https://libgen.is/fiction/recent">Recently added files (1 month)</a></li>
            <li><a href="https://libgen.is/fiction/rss">RSS feed (1 month)</a></li>
          </ul>
        </div>
      </div>
    </li>
  
    <li><a href="https://forum.mhut.org/">Community &amp; support</a></li>
  </ul>
  
  <h1 class="header"><a href="/">Library Genesis</a>: <a href="/fiction/">Fiction</a></h1>
  <p style="margin:1em 0;text-align:center">
  
  
  <a href="https://wiki.mhut.org/project:get_involved">Get involved to help the project!</a><br>
  <a href="https://wiki.mhut.org/catalog:search">A guide to effective catalog searching</a><br>
  Try <a href="https://wiki.mhut.org/software:libgen_desktop">Libgen Desktop</a> application!
  </p>
  
  
  <form id="search_form">

    <div style="margin:0 0 0.5em 0"><input type="text" name="q" bind:value={q} style="width:93%"> <input type="submit" value="search"></div>
    <ul class="inline-fields">
      <li>
        <label title="Choose fields to search in.">Search criteria
          <select name="criteria" bind:value={criteria} style="width:5em">
                    <option value="title">title</option>
                    <option value="authors">authors</option>
                    <option value="series">series</option>
            
          </select>
        </label>
      </li>
      <li>
        <label>Language
          <select name="language" bind:value={language}>
                    <option value="" selected>- any -</option>
                    <option value="-(x-μ)^2/(2σ^2 )">-(x-μ)^2/(2σ^2 )</option>
                    <option value="√( m_1 m_2+m_1 m_2 )">√( m_1 m_2+m_1 m_2 )</option>
                    <option value="1915">1915</option>
                    <option value="1977">1977</option>
                    <option value="Abkhazian">Abkhazian</option>
                    <option value="Achinese">Achinese</option>
                    <option value="Acoli">Acoli</option>
                    <option value="Afaan Oromoo (Oromo)">Afaan Oromoo (Oromo)</option>
                    <option value="Afrikaans">Afrikaans</option>
                    <option value="Albanian">Albanian</option>
                    <option value="All">All</option>
                    <option value="Amazigh">Amazigh</option>
                    <option value="Amharic">Amharic</option>
                    <option value="Ancient Greek">Ancient Greek</option>
                    <option value="Angled Phish">Angled Phish</option>
                    <option value="Antillean Creole (Kwéyòl / Kréyòl)">Antillean Creole (Kwéyòl / Kréyòl)</option>
                    <option value="Antillean Creole (Kwéyòl / Kréyòl); French">Antillean Creole (Kwéyòl / Kréyòl); French</option>
                    <option value="Antillian Creole; French; English; Spanish">Antillian Creole; French; English; Spanish</option>
                    <option value="ar">ar</option>
                    <option value="ara, eng">ara, eng</option>
                    <option value="Arabic">Arabic</option>
                    <option value="Arabic, kurdish">Arabic, kurdish</option>
                    <option value="Aragonese">Aragonese</option>
                    <option value="Armenian">Armenian</option>
                    <option value="Asante Twi">Asante Twi</option>
                    <option value="Assamese">Assamese</option>
                    <option value="Aymara; Quechua; Spanish">Aymara; Quechua; Spanish</option>
                    <option value="Azerbaijani">Azerbaijani</option>
                    <option value="Bambara (Bámánánkán)">Bambara (Bámánánkán)</option>
                    <option value="Bangla">Bangla</option>
                    <option value="Basque">Basque</option>
                    <option value="Basque (Euskara)">Basque (Euskara)</option>
                    <option value="Belarusian">Belarusian</option>
                    <option value="Bengali">Bengali</option>
                    <option value="bg">bg</option>
                    <option value="bhsc">bhsc</option>
                    <option value="Bokmål, Norwegian; Norwegian Bokmål">Bokmål, Norwegian; Norwegian Bokmål</option>
                    <option value="Bosnian">Bosnian</option>
                    <option value="Bosnian, Croatian, Serbian">Bosnian, Croatian, Serbian</option>
                    <option value="Brazilian Portuguese">Brazilian Portuguese</option>
                    <option value="Breton">Breton</option>
                    <option value="bruxellois">bruxellois</option>
                    <option value="Bulgarian">Bulgarian</option>
                    <option value="Burmese">Burmese</option>
                    <option value="Cape Verdean Creole / Kriolu">Cape Verdean Creole / Kriolu</option>
                    <option value="Catalan">Catalan</option>
                    <option value="Catalan; Aranese">Catalan; Aranese</option>
                    <option value="Catalan; Valencian">Catalan; Valencian</option>
                    <option value="Cebuano">Cebuano</option>
                    <option value="Central Khmer">Central Khmer</option>
                    <option value="Chichewa (ciCewa) / Nyanja (ciNyanja)">Chichewa (ciCewa) / Nyanja (ciNyanja)</option>
                    <option value="Chichewa / Nyanja">Chichewa / Nyanja</option>
                    <option value="china">china</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Chinese, English">Chinese, English</option>
                    <option value="chiShona (Shona)">chiShona (Shona)</option>
                    <option value="chiShona (Shona); English">chiShona (Shona); English</option>
                    <option value="chiShona (Shona); Swahili; English">chiShona (Shona); Swahili; English</option>
                    <option value="Cornish">Cornish</option>
                    <option value="Cree">Cree</option>
                    <option value="Croatian">Croatian</option>
                    <option value="Croatian, Serbian,">Croatian, Serbian,</option>
                    <option value="Croatian, Serbian, Bosnian, Serbo-Croatian">Croatian, Serbian, Bosnian, Serbo-Croatian</option>
                    <option value="Czech">Czech</option>
                    <option value="Danish">Danish</option>
                    <option value="Danisk">Danisk</option>
                    <option value="Dansk">Dansk</option>
                    <option value="de">de</option>
                    <option value="deu, eng">deu, eng</option>
                    <option value="deu, ita">deu, ita</option>
                    <option value="Deutsch">Deutsch</option>
                    <option value="deutsch, english">deutsch, english</option>
                    <option value="deutsch, german">deutsch, german</option>
                    <option value="Dholuo">Dholuo</option>
                    <option value="Diné bizaad (Navajo); English">Diné bizaad (Navajo); English</option>
                    <option value="Dutch">Dutch</option>
                    <option value="Dutch / Flemish">Dutch / Flemish</option>
                    <option value="Dutch, Flemisch">Dutch, Flemisch</option>
                    <option value="Dutch; Flemisch">Dutch; Flemisch</option>
                    <option value="Dutch; Flemish">Dutch; Flemish</option>
                    <option value="Dutchh">Dutchh</option>
                    <option value="Dzongkha/Bhutanese">Dzongkha/Bhutanese</option>
                    <option value="Elevate Book - Full Digital Version (PDF)">Elevate Book - Full Digital Version (PDF)</option>
                    <option value="en">en</option>
                    <option value="en-CA">en-CA</option>
                    <option value="en-GB">en-GB</option>
                    <option value="en-US">en-US</option>
                    <option value="eng">eng</option>
                    <option value="eng, eng, nld">eng, eng, nld</option>
                    <option value="eng, fra, fra, jpn">eng, fra, fra, jpn</option>
                    <option value="eng, fra, nld">eng, fra, nld</option>
                    <option value="eng, jpn">eng, jpn</option>
                    <option value="eng, nld">eng, nld</option>
                    <option value="Engligh">Engligh</option>
                    <option value="English">English</option>
                    <option value="English    German">English    German</option>
                    <option value="English / Arabic">English / Arabic</option>
                    <option value="English / French">English / French</option>
                    <option value="English &amp; Croatian">English &amp; Croatian</option>
                    <option value="English Russian">English Russian</option>
                    <option value="English-Greek">English-Greek</option>
                    <option value="English-Italian">English-Italian</option>
                    <option value="English-Turkish">English-Turkish</option>
                    <option value="English, Arabic">English, Arabic</option>
                    <option value="English, Chinese">English, Chinese</option>
                    <option value="English, French">English, French</option>
                    <option value="English, German">English, German</option>
                    <option value="English, Haitian Creole">English, Haitian Creole</option>
                    <option value="English, Italian">English, Italian</option>
                    <option value="English, Japanese">English, Japanese</option>
                    <option value="English, Polish">English, Polish</option>
                    <option value="English, Portuguese">English, Portuguese</option>
                    <option value="English, Russian">English, Russian</option>
                    <option value="English, Spanish">English, Spanish</option>
                    <option value="English, Swedish">English, Swedish</option>
                    <option value="English; French; Spanish; German; Italian;">English; French; Spanish; German; Italian;</option>
                    <option value="English; Greek">English; Greek</option>
                    <option value="English; Haitian Creole / Kreyòl ayisyen">English; Haitian Creole / Kreyòl ayisyen</option>
                    <option value="English; Italian">English; Italian</option>
                    <option value="English; Kiswahili (Swahili)">English; Kiswahili (Swahili)</option>
                    <option value="English; Southern Sotho (Sesotho)">English; Southern Sotho (Sesotho)</option>
                    <option value="English; Yiddish">English; Yiddish</option>
                    <option value="English; Zezuru (chiShona / Shona)">English; Zezuru (chiShona / Shona)</option>
                    <option value="English;Latin">English;Latin</option>
                    <option value="English/Angle">English/Angle</option>
                    <option value="English/German">English/German</option>
                    <option value="Englishĺ">Englishĺ</option>
                    <option value="englsih">englsih</option>
                    <option value="Enlgish, sheet music">Enlgish, sheet music</option>
                    <option value="ERROR">ERROR</option>
                    <option value="Error 400 (Bad Request)!!1">Error 400 (Bad Request)!!1</option>
                    <option value="Esp">Esp</option>
                    <option value="espanish">espanish</option>
                    <option value="Español">Español</option>
                    <option value="Español; Spanish">Español; Spanish</option>
                    <option value="Esperanto">Esperanto</option>
                    <option value="Espernato">Espernato</option>
                    <option value="essp">essp</option>
                    <option value="Estonian">Estonian</option>
                    <option value="et">et</option>
                    <option value="eu">eu</option>
                    <option value="European Portuguese">European Portuguese</option>
                    <option value="Eye and face">Eye and face</option>
                    <option value="Faroese">Faroese</option>
                    <option value="Farsi">Farsi</option>
                    <option value="Filipino">Filipino</option>
                    <option value="Filipino, English">Filipino, English</option>
                    <option value="Filipino; Pilipino">Filipino; Pilipino</option>
                    <option value="Finnish">Finnish</option>
                    <option value="français">français</option>
                    <option value="Franch">Franch</option>
                    <option value="French">French</option>
                    <option value="French, English">French, English</option>
                    <option value="French, picard">French, picard</option>
                    <option value="French, Russian">French, Russian</option>
                    <option value="French, Sango">French, Sango</option>
                    <option value="French; English">French; English</option>
                    <option value="Galego">Galego</option>
                    <option value="Galician">Galician</option>
                    <option value="Gallego">Gallego</option>
                    <option value="Georgian">Georgian</option>
                    <option value="German">German</option>
                    <option value="German - Spanish">German - Spanish</option>
                    <option value="German-English">German-English</option>
                    <option value="German, Middle High (ca.1050-1500)">German, Middle High (ca.1050-1500)</option>
                    <option value="German, Russian">German, Russian</option>
                    <option value="German, Russisch">German, Russisch</option>
                    <option value="Germna">Germna</option>
                    <option value="Gĩgĩkũyũ (Kikuyu)">Gĩgĩkũyũ (Kikuyu)</option>
                    <option value="Greek">Greek</option>
                    <option value="Greek, Ancient Greek">Greek, Ancient Greek</option>
                    <option value="Greek, Modern">Greek, Modern</option>
                    <option value="Greek, Modern (1453-">Greek, Modern (1453-</option>
                    <option value="Greek, Modern (1453-)">Greek, Modern (1453-)</option>
                    <option value="Guaraní">Guaraní</option>
                    <option value="Gujarati">Gujarati</option>
                    <option value="Haitian Creole / Kreyòl ayisyen">Haitian Creole / Kreyòl ayisyen</option>
                    <option value="Haitian Creole / Kreyòl ayisyen; English">Haitian Creole / Kreyòl ayisyen; English</option>
                    <option value="Haitian Creole / Kreyòl ayisyen; French">Haitian Creole / Kreyòl ayisyen; French</option>
                    <option value="Haitian Creole; English; French; Spanish">Haitian Creole; English; French; Spanish</option>
                    <option value="Haitian Creole; French; English">Haitian Creole; French; English</option>
                    <option value="Haitian; Haitian Creole">Haitian; Haitian Creole</option>
                    <option value="Hebrew">Hebrew</option>
                    <option value="HI">HI</option>
                    <option value="Hindi">Hindi</option>
                    <option value="hinglish">hinglish</option>
                    <option value="How-to-Double-Your-Rental-Income.pdf">How-to-Double-Your-Rental-Income.pdf</option>
                    <option value="https://archive.org/account/forgot-password">https://archive.org/account/forgot-password</option>
                    <option value="Hungarian">Hungarian</option>
                    <option value="Icelandic">Icelandic</option>
                    <option value="Igbo">Igbo</option>
                    <option value="Illiterate English">Illiterate English</option>
                    <option value="Inconnu">Inconnu</option>
                    <option value="Indigenous">Indigenous</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Indonesian">Indonesian</option>
                    <option value="Irish">Irish</option>
                    <option value="isiNdebele (Northern Ndebele)">isiNdebele (Northern Ndebele)</option>
                    <option value="isiZulu (Zulu)">isiZulu (Zulu)</option>
                    <option value="IT">IT</option>
                    <option value="Italian">Italian</option>
                    <option value="Italian-Spanish">Italian-Spanish</option>
                    <option value="Italian, Multilingue, Latino">Italian, Multilingue, Latino</option>
                    <option value="Italian; English">Italian; English</option>
                    <option value="Italian; Portuguese">Italian; Portuguese</option>
                    <option value="Italian/English">Italian/English</option>
                    <option value="italiano">italiano</option>
                    <option value="Izon (Ijaw) and English">Izon (Ijaw) and English</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Kannada">Kannada</option>
                    <option value="Kashmiri">Kashmiri</option>
                    <option value="Kazakh">Kazakh</option>
                    <option value="Kiswahili (Swahili)">Kiswahili (Swahili)</option>
                    <option value="Korean">Korean</option>
                    <option value="Korean-English">Korean-English</option>
                    <option value="Kurdish">Kurdish</option>
                    <option value="Kurdish Behdini/Badini dialect">Kurdish Behdini/Badini dialect</option>
                    <option value="La Rozo Supernaturo">La Rozo Supernaturo</option>
                    <option value="Latin">Latin</option>
                    <option value="Latin/Portuguese">Latin/Portuguese</option>
                    <option value="Latvian">Latvian</option>
                    <option value="Lietuvių">Lietuvių</option>
                    <option value="Lingala">Lingala</option>
                    <option value="Lithuanian">Lithuanian</option>
                    <option value="Lithuanian, Lithuanian">Lithuanian, Lithuanian</option>
                    <option value="Lojban">Lojban</option>
                    <option value="Macedonian">Macedonian</option>
                    <option value="Malagasy">Malagasy</option>
                    <option value="Malalayalam">Malalayalam</option>
                    <option value="Malay">Malay</option>
                    <option value="Malayalam">Malayalam</option>
                    <option value="Malayalam Poetry">Malayalam Poetry</option>
                    <option value="Māori">Māori</option>
                    <option value="Marathi">Marathi</option>
                    <option value="Meditative Angelic Diagram">Meditative Angelic Diagram</option>
                    <option value="Meditative Angelic Diagrams">Meditative Angelic Diagrams</option>
                    <option value="Meditative Angelic Diagrams &amp; Scripts">Meditative Angelic Diagrams &amp; Scripts</option>
                    <option value="Meditative Angelic Script">Meditative Angelic Script</option>
                    <option value="Meditative Angelic Scripts">Meditative Angelic Scripts</option>
                    <option value="Meditative Diagram">Meditative Diagram</option>
                    <option value="Meditative Diagrams">Meditative Diagrams</option>
                    <option value="Middle English">Middle English</option>
                    <option value="Mirandese">Mirandese</option>
                    <option value="Moldovan">Moldovan</option>
                    <option value="Moldovan, Romanian">Moldovan, Romanian</option>
                    <option value="Moldovan/Romanian">Moldovan/Romanian</option>
                    <option value="NCERT Smasher -20250326T112151Z-001">NCERT Smasher -20250326T112151Z-001</option>
                    <option value="Nederlands">Nederlands</option>
                    <option value="Nepali">Nepali</option>
                    <option value="nl">nl</option>
                    <option value="nld, deu, eng, nld">nld, deu, eng, nld</option>
                    <option value="None">None</option>
                    <option value="Northern Sami">Northern Sami</option>
                    <option value="Norwegian">Norwegian</option>
                    <option value="Norwegian Bokmål">Norwegian Bokmål</option>
                    <option value="Norwegian Nynorsk">Norwegian Nynorsk</option>
                    <option value="Norwegian Nynorsk; Nynorsk, Norwegian">Norwegian Nynorsk; Nynorsk, Norwegian</option>
                    <option value="Norwegian; Norwegian Bokmål">Norwegian; Norwegian Bokmål</option>
                    <option value="Nzema (Nzima / N&#039;zima)">Nzema (Nzima / N&#039;zima)</option>
                    <option value="Occitan">Occitan</option>
                    <option value="Oriya">Oriya</option>
                    <option value="Otomí">Otomí</option>
                    <option value="Panjabi">Panjabi</option>
                    <option value="Panjabi، Punjabi">Panjabi، Punjabi</option>
                    <option value="Panjabi; Punjabi">Panjabi; Punjabi</option>
                    <option value="Papiamento">Papiamento</option>
                    <option value="Pashto">Pashto</option>
                    <option value="Persian">Persian</option>
                    <option value="Persian-Urdu">Persian-Urdu</option>
                    <option value="Poertuguese">Poertuguese</option>
                    <option value="Polish">Polish</option>
                    <option value="Polish / English">Polish / English</option>
                    <option value="Português">Português</option>
                    <option value="Português - BR">Português - BR</option>
                    <option value="Portugues (Pt Pt)">Portugues (Pt Pt)</option>
                    <option value="Português brasileiro">Português brasileiro</option>
                    <option value="Portuguesa">Portuguesa</option>
                    <option value="Portuguese">Portuguese</option>
                    <option value="Portuguese (BR)">Portuguese (BR)</option>
                    <option value="Portuguese (PT-PT)">Portuguese (PT-PT)</option>
                    <option value="Portuguese Brazilian">Portuguese Brazilian</option>
                    <option value="Portuguese, English">Portuguese, English</option>
                    <option value="Portuguese; German">Portuguese; German</option>
                    <option value="Portuguese/English">Portuguese/English</option>
                    <option value="Portuguesse">Portuguesse</option>
                    <option value="Portuñol">Portuñol</option>
                    <option value="Poster">Poster</option>
                    <option value="PT-BR">PT-BR</option>
                    <option value="PTBR">PTBR</option>
                    <option value="Punjabi">Punjabi</option>
                    <option value="Punjabi-Urdu">Punjabi-Urdu</option>
                    <option value="Pushto; Pashto">Pushto; Pashto</option>
                    <option value="Quechua">Quechua</option>
                    <option value="Quechua; Spanish">Quechua; Spanish</option>
                    <option value="Respiratory">Respiratory</option>
                    <option value="Réunion Creole / Kréol Réyoné">Réunion Creole / Kréol Réyoné</option>
                    <option value="Réunion Creole / Kréol Réyoné; French">Réunion Creole / Kréol Réyoné; French</option>
                    <option value="Romana">Romana</option>
                    <option value="Romana / Engleza">Romana / Engleza</option>
                    <option value="Romanian">Romanian</option>
                    <option value="Romanian, Moldavian">Romanian, Moldavian</option>
                    <option value="Romanian, Moldovan">Romanian, Moldovan</option>
                    <option value="Romanian;">Romanian;</option>
                    <option value="Romanian; Moldavian; Moldovan">Romanian; Moldavian; Moldovan</option>
                    <option value="Romanian/Moldovan">Romanian/Moldovan</option>
                    <option value="Roviana">Roviana</option>
                    <option value="Ru">Ru</option>
                    <option value="Russian">Russian</option>
                    <option value="Russian (Old)">Russian (Old)</option>
                    <option value="Russian / English">Russian / English</option>
                    <option value="Russian, English">Russian, English</option>
                    <option value="Russian, English, French">Russian, English, French</option>
                    <option value="Russian, German">Russian, German</option>
                    <option value="Russian, Italian">Russian, Italian</option>
                    <option value="Russian,English">Russian,English</option>
                    <option value="Russian/English">Russian/English</option>
                    <option value="Sanskrit">Sanskrit</option>
                    <option value="Sardinian">Sardinian</option>
                    <option value="Scots">Scots</option>
                    <option value="Scottish Gaelic">Scottish Gaelic</option>
                    <option value="Sepedi (Northern Sotho)">Sepedi (Northern Sotho)</option>
                    <option value="Serbian">Serbian</option>
                    <option value="Serbo-Croatian">Serbo-Croatian</option>
                    <option value="Serbo-Croatian, Bosnian, Croatian, Serbian">Serbo-Croatian, Bosnian, Croatian, Serbian</option>
                    <option value="Sesotho (Southern Sotho)">Sesotho (Southern Sotho)</option>
                    <option value="Setswana (Tswana)">Setswana (Tswana)</option>
                    <option value="Shipibo-Konibo">Shipibo-Konibo</option>
                    <option value="Sindhi">Sindhi</option>
                    <option value="Slovak">Slovak</option>
                    <option value="Slovene">Slovene</option>
                    <option value="Slovene, Slovenian">Slovene, Slovenian</option>
                    <option value="Slovenian">Slovenian</option>
                    <option value="Somali">Somali</option>
                    <option value="Somali (af Soomaali)">Somali (af Soomaali)</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Spanish and Zapotec">Spanish and Zapotec</option>
                    <option value="Spanish-English">Spanish-English</option>
                    <option value="Spanish, Castilian">Spanish, Castilian</option>
                    <option value="Spanish, Chontal">Spanish, Chontal</option>
                    <option value="spanish, english">spanish, english</option>
                    <option value="Spanish, German">Spanish, German</option>
                    <option value="Spanish, Mapudungun">Spanish, Mapudungun</option>
                    <option value="Spanish, Mexican">Spanish, Mexican</option>
                    <option value="Spanish; Aymara">Spanish; Aymara</option>
                    <option value="Spanish; Castilian">Spanish; Castilian</option>
                    <option value="Spanish; Castilian Spanish">Spanish; Castilian Spanish</option>
                    <option value="Spanish; Colombian">Spanish; Colombian</option>
                    <option value="Spanish; english">Spanish; english</option>
                    <option value="Spanish; French">Spanish; French</option>
                    <option value="Spanish; Italian">Spanish; Italian</option>
                    <option value="Spanish; Latin Spanish">Spanish; Latin Spanish</option>
                    <option value="Spanish; Portuguese">Spanish; Portuguese</option>
                    <option value="Spanish; Quechua">Spanish; Quechua</option>
                    <option value="Spanish; Quechua; Aymara">Spanish; Quechua; Aymara</option>
                    <option value="Spanish; Vietnamese">Spanish; Vietnamese</option>
                    <option value="Spanish;Castilianish;Castilian">Spanish;Castilianish;Castilian</option>
                    <option value="Spanish;Castiliannish;Castilian">Spanish;Castiliannish;Castilian</option>
                    <option value="Spanish;Mexican">Spanish;Mexican</option>
                    <option value="Spanish;Portuguese">Spanish;Portuguese</option>
                    <option value="Spañol">Spañol</option>
                    <option value="Srpski">Srpski</option>
                    <option value="srpsko-hrvatski">srpsko-hrvatski</option>
                    <option value="St. Lucian Creole / Kwéyòl; English">St. Lucian Creole / Kwéyòl; English</option>
                    <option value="Sunda">Sunda</option>
                    <option value="sv">sv</option>
                    <option value="Swahili">Swahili</option>
                    <option value="Swedish">Swedish</option>
                    <option value="Swedish, English">Swedish, English</option>
                    <option value="Swedish, Norwegian, Danish">Swedish, Norwegian, Danish</option>
                    <option value="Tagalog">Tagalog</option>
                    <option value="Tahitian">Tahitian</option>
                    <option value="Tamazight">Tamazight</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Thai">Thai</option>
                    <option value="Thai; English">Thai; English</option>
                    <option value="Thai; Kelantan-Pattani Malay">Thai; Kelantan-Pattani Malay</option>
                    <option value="Thai; Malay; Jawi">Thai; Malay; Jawi</option>
                    <option value="Tibetan">Tibetan</option>
                    <option value="Tiếng Việt (Vietnamese)">Tiếng Việt (Vietnamese)</option>
                    <option value="tl">tl</option>
                    <option value="tr, kz">tr, kz</option>
                    <option value="Tshivenda (Venda); English">Tshivenda (Venda); English</option>
                    <option value="Tswana">Tswana</option>
                    <option value="Turkish">Turkish</option>
                    <option value="Turkish, Arabic">Turkish, Arabic</option>
                    <option value="Turkish, English">Turkish, English</option>
                    <option value="Turkish, English, Arabic">Turkish, English, Arabic</option>
                    <option value="Turkish, German">Turkish, German</option>
                    <option value="Turkish, Ottoman (1500-1928)">Turkish, Ottoman (1500-1928)</option>
                    <option value="Turkish, Spanish">Turkish, Spanish</option>
                    <option value="Turkmen">Turkmen</option>
                    <option value="Udmurt">Udmurt</option>
                    <option value="Ukrainian">Ukrainian</option>
                    <option value="Ukrainian, English">Ukrainian, English</option>
                    <option value="Ukrainian, Polish, Slovak">Ukrainian, Polish, Slovak</option>
                    <option value="Ukrainian, Russian">Ukrainian, Russian</option>
                    <option value="Undetermined">Undetermined</option>
                    <option value="Urdu">Urdu</option>
                    <option value="Uzbek">Uzbek</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Vietnamese">Vietnamese</option>
                    <option value="Wayuunaiki">Wayuunaiki</option>
                    <option value="Welsh">Welsh</option>
                    <option value="Wolof">Wolof</option>
                    <option value="Wolof; French">Wolof; French</option>
                    <option value="wordless">wordless</option>
                    <option value="Xitsonga (Tsonga)">Xitsonga (Tsonga)</option>
                    <option value="Yiddish">Yiddish</option>
                    <option value="Yiddish, English">Yiddish, English</option>
                    <option value="Yugoslavian">Yugoslavian</option>
                    <option value="Zapoteco">Zapoteco</option>
                    <option value="Zhuang; Chuang">Zhuang; Chuang</option>
                    <option value="руский">руский</option>
                    <option value="русский">русский</option>
                    <option value="русский и английский">русский и английский</option>
                    <option value="Русский; Russian">Русский; Russian</option>
                    <option value="עברית">עברית</option>
                    <option value="اردو">اردو</option>
                    <option value="العربية">العربية</option>
                    <option value="سرائیکی">سرائیکی</option>
                    <option value="عربي">عربي</option>
                    <option value="عربية arabic">عربية arabic</option>
                    <option value="فارسی">فارسی</option>
                    <option value="ไทย">ไทย</option>
                    <option value="中文">中文</option>
                    <option value="日本語 (Japanese)">日本語 (Japanese)</option>
                    <option value="繁体中文">繁体中文</option>
            
          </select>
        </label>
      </li>
      <li>
        <label>Format
          <select name="format" bind:value={format}>
                    <option value="" selected>- any -</option>
                    <option value="epub">EPUB</option>
                    <option value="mobi">MOBI</option>
                    <option value="azw">AZW</option>
                    <option value="azw3">AZW3</option>
                    <option value="fb2">FB2</option>
                    <option value="pdf">PDF</option>
                    <option value="rtf">RTF</option>
                    <option value="txt">TXT</option>
            
          </select>
        </label>
      </li>
    </ul>
  </form>

<div style="clear:both"></div>

<table class="catalog">
<thead><tr>
	<td style="width:15%">						<p title="sort">Author(s) <span class="sort_direction">&varr;</span></p>
			</td>
	<td>						<p  title="sort">Series <span class="sort_direction">&varr;</span></p>
			</td>
	<td>						<p title="sort">Title <span class="sort_direction">&varr;</span></p>
			</td>
	<td>						<p title="sort">Language <span class="sort_direction">&varr;</span></p>
			</td>
	<td style="width:9em">						<p title="sort">File <span class="sort_direction">&varr;</span></p>
			</td>
</tr></thead>

<tbody>
{#each results as result}
  <tr>
    <td>
      <ul class="catalog_authors">
        <li><a href="/fiction/?q={result.Author}&criteria=authors" title="search by author">{result.Author}</a></li>
      </ul>
        </td>
    <td>{result.Series}</td>
    <td>
      <p><a href="https://arweave.net/{result.txid}">{result.Title}</a></p>
      <p class="catalog_identifier">ISBN: {result.ISBN}</p>	</td>
    <td>English</td>
    <td title="Uploaded at 2021-11-03 17:12:20">{result.Extension.toUpperCase()} / {(result.Filesize / 1000000).toFixed(2)}&nbsp;Mb</td>
  </tr>
{/each}
</tbody>
</table>


<p style="margin:1em 0;text-align:center"> We are saving the whole libgen catalog forever on arweave, starting with the Fiction part (+3 million books). You can contribute to the effort here <a href="https://github.com/niglomeister/arweave-libgen-sync">Here</a> </p>
<!-- <progress value="10" max="300" style="width : 100%"></progress> -->
</main>