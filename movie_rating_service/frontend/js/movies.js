// Переменные
let allMovies = [];
let filteredMovies = [];
let currentMovieId = null; // Для редактирования

// Запускается когда страница фильмов загружена
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем что мы на странице фильмов
    if (!document.getElementById('movies-grid')) return;
    
    // Загружаем фильмы
    loadMovies();
    
    // Настраиваем обработчики событий
    setupEventListeners();
});

// Загружает фильмы с сервера
async function loadMovies() {
    try {
        const loadingElement = document.querySelector('#movies-grid .loading');
        if (loadingElement) {
            loadingElement.textContent = 'Загрузка фильмов...';
        }
        
        allMovies = await api.getMovies();
        filteredMovies = [...allMovies];
        
        // Обновляем счетчик
        document.getElementById('movie-count').textContent = `${allMovies.length} фильмов`;
        
        // Показываем фильмы
        renderMovies();
        
    } catch (error) {
        console.error('Ошибка загрузки фильмов:', error);
        document.querySelector('#movies-grid .loading').textContent = 'Ошибка загрузки фильмов';
    }
}

// Показывает фильмы на странице
function renderMovies() {
    const grid = document.getElementById('movies-grid');
    const noMoviesElement = document.getElementById('no-movies');
    
    // Очищаем сетку
    grid.innerHTML = '';
    
    if (filteredMovies.length === 0) {
        // Показываем сообщение "нет фильмов"
        noMoviesElement.style.display = 'block';
        return;
    }
    
    // Скрываем сообщение "нет фильмов"
    noMoviesElement.style.display = 'none';
    
    // Добавляем карточки фильмов
    filteredMovies.forEach(movie => {
        const card = createMovieCard(movie);
        
        // Показываем кнопки CRUD
        const crudActions = card.querySelector('.crud-actions');
        if (crudActions) {
            crudActions.style.display = 'flex';
            
            // Назначаем обработчики для кнопок
            const editBtn = crudActions.querySelector('.btn-edit');
            const deleteBtn = crudActions.querySelector('.btn-delete');
            
            if (editBtn) {
                editBtn.addEventListener('click', () => openMovieForm(movie));
            }
            
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => deleteMovie(movie.id));
            }
        }
        
        grid.appendChild(card);
    });
}

// Настраивает обработчики событий
function setupEventListeners() {
    // Кнопка "Добавить фильм"
    const addBtn = document.getElementById('add-movie-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => openMovieForm());
    }
    
    // Слайдер рейтинга
    const ratingSlider = document.getElementById('rating-slider');
    const ratingValue = document.getElementById('rating-value');
    
    if (ratingSlider && ratingValue) {
        ratingSlider.addEventListener('input', function() {
            ratingValue.textContent = this.value;
            filterMovies();
        });
    }
    
    // Кнопка сброса фильтров
    const resetBtn = document.getElementById('reset-filters-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
    
    // Форма фильма
    const movieForm = document.getElementById('movie-form');
    if (movieForm) {
        movieForm.addEventListener('submit', handleMovieSubmit);
    }
    
    // Поле URL постера (предпросмотр)
    const posterUrlInput = document.getElementById('movie-poster-url');
    if (posterUrlInput) {
        posterUrlInput.addEventListener('input', updatePosterPreview);
    }
}

// Фильтрует фильмы по рейтингу
function filterMovies() {
    const minRating = parseFloat(document.getElementById('rating-slider').value);
    
    if (minRating > 0) {
        filteredMovies = allMovies.filter(movie => 
            movie.rating && movie.rating >= minRating
        );
    } else {
        filteredMovies = [...allMovies];
    }
    
    // Обновляем счетчик
    document.getElementById('movie-count').textContent = `${filteredMovies.length} фильмов`;
    
    // Перерисовываем фильмы
    renderMovies();
}

// Сбрасывает фильтры
function resetFilters() {
    document.getElementById('rating-slider').value = 0;
    document.getElementById('rating-value').textContent = '0.0';
    filterMovies();
}

// Открывает форму для добавления/редактирования фильма
function openMovieForm(movie = null) {
    const modal = document.getElementById('movie-form-modal');
    const formTitle = document.getElementById('form-title');
    
    // Если передали фильм - режим редактирования
    if (movie) {
        formTitle.textContent = 'Редактировать фильм';
        currentMovieId = movie.id;
        
        // Заполняем поля формы
        document.getElementById('movie-id').value = movie.id;
        document.getElementById('movie-title').value = movie.title || '';
        document.getElementById('movie-description').value = movie.description || '';
        document.getElementById('movie-rating').value = movie.rating || 0;
        document.getElementById('movie-year').value = movie.release_year || new Date().getFullYear();
        document.getElementById('movie-genres').value = movie.genres ? movie.genres.join(', ') : '';
        document.getElementById('movie-poster-url').value = movie.poster_url || '';
    } else {
        // Режим добавления
        formTitle.textContent = 'Добавить фильм';
        currentMovieId = null;
        
        // Очищаем форму
        document.getElementById('movie-id').value = '';
        document.getElementById('movie-title').value = '';
        document.getElementById('movie-description').value = '';
        document.getElementById('movie-rating').value = 0;
        document.getElementById('movie-year').value = new Date().getFullYear();
        document.getElementById('movie-genres').value = '';
        document.getElementById('movie-poster-url').value = '';
    }
    
    // Обновляем предпросмотр постера
    updatePosterPreview();
    
    // Показываем форму
    modal.style.display = 'flex';
}

// Закрывает форму фильма
function closeMovieForm() {
    document.getElementById('movie-form-modal').style.display = 'none';
    currentMovieId = null;
}

// Обновляет предпросмотр постера
function updatePosterPreview() {
    const url = document.getElementById('movie-poster-url').value;
    const preview = document.getElementById('poster-preview');
    
    if (url) {
        preview.innerHTML = `
            <p style="margin-bottom: 5px; font-size: 12px; color: #718096;">Предпросмотр:</p>
            <img src="${url}" style="max-width: 100%; max-height: 150px; border-radius: 6px;" 
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
            <p style="color: #e53e3e; font-size: 12px; display: none;">⚠️ Не удалось загрузить изображение</p>
        `;
    } else {
        preview.innerHTML = '';
    }
}

// Обрабатывает отправку формы фильма
async function handleMovieSubmit(event) {
    event.preventDefault();
    
    // Собираем данные из формы
    const movieData = {
        title: document.getElementById('movie-title').value.trim(),
        description: document.getElementById('movie-description').value.trim(),
        rating: parseFloat(document.getElementById('movie-rating').value) || 0,
        release_year: parseInt(document.getElementById('movie-year').value),
        genres: document.getElementById('movie-genres').value
            .split(',')
            .map(g => g.trim())
            .filter(g => g.length > 0),
        poster_url: document.getElementById('movie-poster-url').value.trim() || null
    };
    
    try {
        if (currentMovieId) {
            // Редактирование существующего фильма
            await api.updateMovie(currentMovieId, movieData);
            showAlert('Фильм успешно обновлен!', 'success');
        } else {
            // Добавление нового фильма
            await api.createMovie(movieData);
            showAlert('Фильм успешно добавлен!', 'success');
        }
        
        // Закрываем форму и обновляем список
        closeMovieForm();
        await loadMovies();
        
    } catch (error) {
        console.error('Ошибка сохранения фильма:', error);
        showAlert('Ошибка: ' + (error.message || 'Не удалось сохранить фильм'), 'error');
    }
}

// Удаляет фильм
async function deleteMovie(movieId) {
    if (!confirm('Вы уверены, что хотите удалить этот фильм?')) return;
    
    try {
        await api.deleteMovie(movieId);
        showAlert('Фильм успешно удален!', 'success');
        await loadMovies();
    } catch (error) {
        console.error('Ошибка удаления фильма:', error);
        showAlert('Ошибка удаления фильма', 'error');
    }
}

// Глобальные функции для вызова из HTML
window.openMovieForm = openMovieForm;
window.closeMovieForm = closeMovieForm;
window.deleteMovie = deleteMovie;