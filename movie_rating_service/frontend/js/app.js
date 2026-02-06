// Общие функции для всего сайта

// Запускается когда страница загружена
document.addEventListener('DOMContentLoaded', function() {
    // Подсветка активной ссылки в меню
    highlightActiveNavLink();
});

// Подсвечивает активную страницу в навигации
function highlightActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        
        // Сравниваем текущую страницу с ссылкой
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (currentPage === 'index.html' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Создает карточку фильма (используется в movies.js и genres.js)
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    
    // Обработка рейтинга
    const rating = movie.rating ? movie.rating.toFixed(1) : 'N/A';
    
    // Обработка жанров
    let genresHTML = '';
    if (movie.genres && movie.genres.length > 0) {
        genresHTML = movie.genres.map(genre => 
            `<span class="genre-tag">${genre}</span>`
        ).join('');
    } else {
        genresHTML = '<span class="no-genres">Нет жанров</span>';
    }
    
    // Обработка описания
    let description = movie.description || 'Нет описания';
    if (description.length > 100) {
        description = description.substring(0, 100) + '...';
    }
    
    // URL постера
    const posterUrl = movie.poster_url || 
        `https://via.placeholder.com/300x450/2d3748/ffffff?text=${encodeURIComponent(movie.title.substring(0, 20))}`;
    
    // HTML карточки
    card.innerHTML = `
        <div class="movie-poster">
            <img src="${posterUrl}" alt="${movie.title}" class="poster-image" onerror="this.src='https://via.placeholder.com/300x450'">
            <div class="movie-rating">${rating}</div>
        </div>
        
        <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <p class="movie-year">📅 ${movie.release_year}</p>
            
            <div class="movie-genres">
                ${genresHTML}
            </div>
            
            <p class="movie-description">${description}</p>
            
            <!-- Кнопки будут добавлены только на странице фильмов -->
            <div class="crud-actions" style="display: none;">
                <button class="btn-edit" data-id="${movie.id}">✏️ Редактировать</button>
                <button class="btn-delete" data-id="${movie.id}">🗑️ Удалить</button>
            </div>
        </div>
    `;
    
    return card;
}

// Показывает уведомление
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1'};
        color: white;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 3000);
}