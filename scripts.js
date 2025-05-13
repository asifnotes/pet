document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile nav
  document.querySelector('.nav-toggle').onclick = () =>
    document.querySelector('.main-nav').classList.toggle('open');

  // UTIL: render star rating
  function stars(n) { return '★'.repeat(n) + '☆'.repeat(5-n); }

  // 2. Adoption Directory (from previous prototype)
  // … assume populateFilters and renderList functions from before …

  // 3. Care Guide
  fetch('care.json')
    .then(r=>r.json())
    .then(data => {
      const catSel = document.getElementById('filter-category');
      const search = document.getElementById('search-care');
      const container = document.getElementById('care-list');

      // populate categories
      [...new Set(data.map(a=>a.category))].sort()
        .forEach(c => catSel.innerHTML += `<option>${c}</option>`);

      function render(items) {
        container.innerHTML = items.map(a=>`
          <div class="card">
            <img src="${a.image}" alt="${a.title}">
            <div class="card-content">
              <h3>${a.title}</h3>
              <p>${a.excerpt}</p>
              <a href="#" class="btn">Read More</a>
            </div>
          </div>`).join('');
      }
      render(data);
      // filters
      [catSel, search].forEach(el => el.oninput = () => {
        const cat = catSel.value.toLowerCase();
        const txt = search.value.toLowerCase();
        render(data.filter(a=>
          (cat===''||a.category.toLowerCase()===cat)
          && a.title.toLowerCase().includes(txt)
        ));
      });
    });

  // 4. Community Forum
  fetch('forum.json')
    .then(r=>r.json())
    .then(threads => {
      const list = document.getElementById('forum-list');
      list.innerHTML = threads.map(t=>`
        <div class="thread">
          <h4>${t.title}</h4>
          <div class="meta">by ${t.author} • ${t.upvotes} upvotes • ${t.comments} comments</div>
          <a href="#" class="btn">View Thread</a>
        </div>`).join('');
    });

  // 5. Online Store & Cart
  let cart = [];
  fetch('products.json')
    .then(r=>r.json())
    .then(items => {
      const grid = document.getElementById('product-list');
      const cartEl = document.getElementById('cart-items');
      function updateCart() {
        cartEl.innerHTML = cart.map(p=>`<li>${p.name} — $${p.price.toFixed(2)}</li>`).join('');
      }
      grid.innerHTML = items.map(p=>`
        <div class="card">
          <img src="${p.image}" alt="${p.name}">
          <div class="card-content">
            <h3>${p.name}</h3>
            <p>$${p.price.toFixed(2)}</p>
            <button class="btn" data-id="${p.id}">Add to Cart</button>
          </div>
        </div>`).join('');
      grid.querySelectorAll('button').forEach(btn=>{
        btn.onclick = ()=> {
          const prod = items.find(i=>i.id==btn.dataset.id);
          cart.push(prod);
          updateCart();
        };
      });
      document.getElementById('checkout').onclick = () =>
        alert('Checkout is static in this prototype.');
    });

  // 6. Gallery Carousel & Testimonials
  Promise.all([fetch('gallery.json').then(r=>r.json()),
               fetch('testimonials.json').then(r=>r.json())])
    .then(([slides, reviews])=>{
      // Carousel
      const carousel = document.getElementById('carousel');
      slides.forEach((s,i) => {
        const div = document.createElement('div');
        div.className = 'slide'+(i===0?' active':'');
        div.innerHTML = `<img src="${s.image}" alt="${s.caption}">`;
        carousel.append(div);
      });
      // simple auto-rotate
      let idx=0;
      setInterval(()=>{
        carousel.querySelector('.active').classList.remove('active');
        idx = (idx+1)%slides.length;
        carousel.children[idx].classList.add('active');
      }, 4000);

      // Testimonials
      const testEl = document.getElementById('testimonials');
      testEl.innerHTML = reviews.map(r=>`
        <div class="testimonial">
          <div class="rating">${stars(r.rating)}</div>
          <p>"${r.text}"</p>
          <p><strong>— ${r.name}</strong></p>
        </div>`).join('');
    });

  // 7. Initialize Adoption Directory too (reuse from previous code)
  // … fetch('cats.json') and wire up filters & renderList …
});
