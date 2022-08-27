const search = document.getElementById('search-doi');
console.log(search)

const fetchCitation = async (doi) => {
    const URL = (window.location.hostname);
    const data = await fetch(`http://${URL}/citation-data?doi=${doi}`)
    const json = await data.json()
    return json
}
search.addEventListener('click', function(e) {
    e.preventDefault();
    const URL = (window.location.hostname);
    const doi = document.getElementById('doi-input').value;
    console.log(`http://${URL}/citation-data?doi=${doi}`)
    // const data = fetchCitation(doi)
    fetch(`http://${URL}/citation-data?doi=${doi}`)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        const title_of_paper = document.getElementById('title-of-paper');
        title_of_paper.value = data[0].title;
        const issn_number = document.getElementById('issn');
        issn_number.value = data[0].ISSN;
        const unique_id = document.getElementById('uid');
        unique_id.value = data[0].id;
        const author = document.getElementById('name');
        author.value = data[0].author[0].given +' '+ data[0].author[0].family +', '+ data[0].author[1].given +' '+ data[0].author[1].family;
        const link = document.getElementById('link');
        link.value = data[0].URL;
    }
    )
})