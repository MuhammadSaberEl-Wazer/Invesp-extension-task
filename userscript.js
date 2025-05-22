// Invesp Extension task - JS and CSS Only

const modal = document.createElement('div');
modal.className = 'quick-view-modal';
modal.innerHTML = `
  <div class="quick-view-container">
    <div class="quick-view-gallery">
      <div class="main-image-container">
        <button class="image-nav prev-btn">‹</button>
        <button class="image-nav next-btn">›</button>
      </div>
      <div class="thumbnails-wrapper">
        <button class="thumb-nav left-thumb-nav">‹</button>
        <div class="thumbnail-container"></div>
        <button class="thumb-nav right-thumb-nav">›</button>
      </div>
    </div>
    <div class="quick-view-content">
      <button class="close-quick-view">✕</button>
      <h2 class="quick-view-title"></h2>
      <div class="quick-view-price"></div>
      <div class="quick-view-description"></div>
      <a href="#" class="view-full-product">View Full Product Details</a>
    </div>
  </div>
`;
document.body.appendChild(modal);

function addQuickViewButtons() {
  const cards = document.querySelectorAll('.product-card');

  cards.forEach(card => {
    if (card.classList.contains('product-card-with-quickview')) return;

    card.classList.add('product-card-with-quickview');

    const btn = document.createElement('button');
    btn.className = 'quick-view-btn-extension';
    btn.textContent = 'Quick View';

    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      btn.textContent = 'Loading...';

      try {
        const productLink = card.querySelector('a.link-wrapper');
        if (!productLink) throw new Error('No product link found');

        const productUrl = productLink.href;
        const response = await fetch(productUrl);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const productData = {
          title: doc.querySelector('title')?.textContent.trim() || 'No title found',
          price: doc.querySelector('span.price')?.textContent.trim() || 'No price found',
          description: doc.querySelector('div.product-description.translated-content[lang="en"]')?.textContent.trim() || 'No description found',
          images: Array.from(doc.querySelectorAll('a.link[href^="https://cdn20"]')).map(link => link.href),
          productUrl: productUrl
        };

        showQuickViewModal(productData);
        btn.textContent = 'Quick View';
      } catch (error) {
        console.error('Error:', error);
        btn.textContent = 'Error!';
        setTimeout(() => btn.textContent = 'Quick View', 1000);
      }
    });

    card.appendChild(btn);
  });
}

function showQuickViewModal(productData) {
  const modal = document.querySelector('.quick-view-modal');
  const mainImageContainer = modal.querySelector('.main-image-container');
  const thumbnailContainer = modal.querySelector('.thumbnail-container');
  
  mainImageContainer.querySelector('img')?.remove();
  thumbnailContainer.innerHTML = '';

  if (productData.images.length > 0) {
    const mainImg = document.createElement('img');
    mainImg.src = productData.images[0];
    mainImg.alt = productData.title;
    mainImg.className = 'main-product-image active';
    mainImageContainer.insertBefore(mainImg, mainImageContainer.firstChild);
  }

  let currentImageIndex = 0;
  const totalImages = productData.images.length;

  function updateMainImage(newIndex) {
    const img = mainImageContainer.querySelector('img');
    if (img && productData.images[newIndex]) {
      img.classList.remove('active');
      void img.offsetWidth;
      img.src = productData.images[newIndex];
      img.alt = productData.title;
      img.classList.add('active');
    }
    currentImageIndex = newIndex;
  }

  function setActiveThumbnail(newIndex) {
    const thumbs = thumbnailContainer.querySelectorAll('img');
    thumbs.forEach(thumb => thumb.classList.remove('active-thumbnail'));
    thumbs[newIndex]?.classList.add('active-thumbnail');
  }

  function centerThumbnail(index) {
    const thumb = thumbnailContainer.children[index];
    if (thumb) {
      const containerWidth = thumbnailContainer.offsetWidth;
      const thumbLeft = thumb.offsetLeft;
      const thumbWidth = thumb.offsetWidth;
      const scrollPos = thumbLeft - (containerWidth / 2) + (thumbWidth / 2);
      thumbnailContainer.scrollTo({
        left: scrollPos,
        behavior: 'smooth'
      });
    }
  }

  function navigateImages(direction) {
    let newIndex;
    if (direction === 'prev') {
      newIndex = (currentImageIndex - 1 + totalImages) % totalImages;
    } else {
      newIndex = (currentImageIndex + 1) % totalImages;
    }
    updateMainImage(newIndex);
    setActiveThumbnail(newIndex);
    centerThumbnail(newIndex);
  }

  productData.images.forEach((imgSrc, index) => {
    const thumbImg = document.createElement('img');
    thumbImg.src = imgSrc;
    thumbImg.alt = `Thumbnail ${index + 1}`;
    thumbImg.dataset.index = index;
    if (index === 0) thumbImg.classList.add('active-thumbnail');

    let hoverTimer;
    thumbImg.addEventListener('mouseenter', () => {
      hoverTimer = setTimeout(() => {
        updateMainImage(index);
        setActiveThumbnail(index);
      }, 150);
    });

    thumbImg.addEventListener('mouseleave', () => {
      clearTimeout(hoverTimer);
    });

    thumbImg.addEventListener('click', (e) => {
      e.preventDefault();
      clearTimeout(hoverTimer);
      updateMainImage(index);
      setActiveThumbnail(index);
      centerThumbnail(index);
    });

    thumbnailContainer.appendChild(thumbImg);
  });

  modal.querySelector('.prev-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    navigateImages('prev');
  });

  modal.querySelector('.next-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    navigateImages('next');
  });

  modal.querySelector('.left-thumb-nav').addEventListener('click', (e) => {
    e.stopPropagation();
    thumbnailContainer.scrollBy({
      left: -150,
      behavior: 'smooth'
    });
  });

  modal.querySelector('.right-thumb-nav').addEventListener('click', (e) => {
    e.stopPropagation();
    thumbnailContainer.scrollBy({
      left: 150,
      behavior: 'smooth'
    });
  });

  function updateThumbNavVisibility() {
    const leftNav = modal.querySelector('.left-thumb-nav');
    const rightNav = modal.querySelector('.right-thumb-nav');
    
    leftNav.style.display = thumbnailContainer.scrollLeft > 0 ? 'flex' : 'none';
    rightNav.style.display = thumbnailContainer.scrollLeft < thumbnailContainer.scrollWidth - thumbnailContainer.offsetWidth ? 'flex' : 'none';
  }

  thumbnailContainer.addEventListener('scroll', updateThumbNavVisibility);
  updateThumbNavVisibility();

  modal.querySelector('.quick-view-title').textContent = productData.title;
  modal.querySelector('.quick-view-price').textContent = productData.price;
  modal.querySelector('.quick-view-description').textContent = productData.description;
  modal.querySelector('.view-full-product').href = productData.productUrl;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  modal.querySelector('.close-quick-view').onclick = closeModal;

  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  function handleKeyDown(e) {
    if (!modal.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'ArrowLeft') {
      navigateImages('prev');
    } else if (e.key === 'ArrowRight') {
      navigateImages('next');
    }
  }

  document.addEventListener('keydown', handleKeyDown);

  modal.cleanup = function() {
    document.removeEventListener('keydown', handleKeyDown);
    thumbnailContainer.removeEventListener('scroll', updateThumbNavVisibility);
    delete modal.cleanup;
  };
}

function closeModal() {
  const modal = document.querySelector('.quick-view-modal');
  if (modal.cleanup) modal.cleanup();
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

addQuickViewButtons();

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length) {
      addQuickViewButtons();
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

setInterval(addQuickViewButtons, 2000);