import convert from './index.js'

let testHtml = String.raw`<article class="container bg-white shadow-2xl rounded-2xl p-5">
<h1 class="font-bold text-yellow-500">Mon blog en ligne</h1>
<p class="font-light text-gray-500 hover:font-bold">Aujoud'hui dans mon blog nous allons parler de fruits et légumes.....</p>
<h6 class="text-sm text-gray-300 mb-5">Publiée le 08/10/2022</h6>
<a href="#" class="rounded-lg py-2 px-4 text-center text-white bg-yellow-400 hover:bg-yellow-500">En savoir plus</a>
</article>`

let res = convert(testHtml)
console.log(res)