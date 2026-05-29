import dayjs from 'dayjs';

const SUPABASE_URL = 'https://kpihpvxocbwiiqtdxbmq.supabase.co/rest/v1/'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwaWhwdnhvY2J3aWlxdGR4Ym1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MTk1NjYsImV4cCI6MjA5NTI5NTU2Nn0.CtVwl4azGkaOM2AA6JoFoa8DFrqVjy98rZhce1GDHGE';

async function fetchArticles() {
    try {
        const selectElement = document.getElementById('sortSelect');
        const orderParam = selectElement.value;

        const url = SUPABASE_URL + 'article?select=*&order=' + orderParam;

        const response = await fetch(url, {
            headers: {
                'apiKey': SUPABASE_KEY,
            }
        });

        const data = await response.json();
        
        const container = document.getElementById('articlesContainer');
        container.innerHTML = '';

        for (let i = 0; i < data.length; i++) {
            let article = data[i];

            let formattedDate = dayjs(article.created_at).format('DD-MM-YYYY');

            let author = article.author;
            if (author === null) { author = "Nieznany"; }

            let subtitle = article.subtitle;
            if (subtitle === null) { subtitle = ""; }

            let box = '<div class="bg-white p-6 rounded shadow border border-gray-200 mb-4">';
            box += '<h2 class="text-2xl font-bold">' + article.title + '</h2>';
            box += '<h3 class="text-lg text-gray-600">' + subtitle + '</h3>';
            box += '<p class="text-blue-500 font-bold">Autor: ' + author + ' | Data: ' + formattedDate + '</p>';
            box += '<p>' + article.content + '</p>';
            box += '</div>';

            container.innerHTML += box;
        }

    } catch (error) {
        console.error('Fetch error:', error);
    }
}


const form = document.getElementById('addArticleForm');

form.addEventListener('submit', async function(e) {
    e.preventDefault(); 

    const newArticle = {};
    newArticle.title = document.getElementById('title').value;
    newArticle.subtitle = document.getElementById('subtitle').value;
    newArticle.author = document.getElementById('author').value;
    newArticle.content = document.getElementById('content').value;

    const dateValue = document.getElementById('created_at').value;
    if (dateValue !== "") {
        newArticle.created_at = dateValue;
    }

    try {
        const response = await fetch(SUPABASE_URL + 'article', {
            method: 'POST',
            headers: {
                'apiKey': SUPABASE_KEY,
                'Authorization': 'Bearer ' + SUPABASE_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newArticle)
        });

        if (response.status !== 201) {
          throw new Error(`Status: ${response.status}`);
        }

        form.reset();
        fetchArticles();

    } catch (error) {
        console.error('Fetch error:', error);
    }
});


const sortSelect = document.getElementById('sortSelect');
sortSelect.addEventListener('change', function() {
    fetchArticles();
});

fetchArticles();