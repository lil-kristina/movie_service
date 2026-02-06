// Переменные
let allGenres = [];
let allMovies = [];
let selectedGenre = null;

// Запускается когда страница жанров загружена
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем что мы на странице жанров
    if (!document.getElementById('genres-container')) return;
    
    // Загружаем данные
    loadData();
});

// Загружает жанры и фильмы
async function loadData() {
    try {
        // Загружаем жанры
        const genresData = await api.getGenres();
        allGenres = genresData.genres || [];
        
        // Загружаем фильмы
        allMovies = await api.getMovies();
        
        // Показываем данные
        renderGenres();
        renderAllMovies();
        
        // Скрываем загрузку, показываем контент
        document.getElementById('loading-genres').style.display = 'none';
        document.getElementById('genres-container').style.display = 'block';
        
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        document.getElementById('loading-genres').style.display = 'none';
        document.getElementById('error-genres').style.display = 'block';
    }
}

// Показывает кнопки жанров
function renderGenres() {
    const container = document.getElementById('genres-buttons');
    const countElement = document.getElementById('genres-count');
    
    // Обновляем счетчик
    countElement.textContent = allGenres.length;
    
    // Очищаем контейнер
    container.innerHTML = '';
    
    // Создаем кнопки для каждого жанра
    allGenres.forEach(genre => {
        const button = document.createElement('button');
        button.className = 'genre-btn';
        button.textContent = genre;
        button.addEventListener('click', () => selectGenre(genre));
        container.appendChild(button);
    });
}

// Показывает все фильмы
function renderAllMovies() {
    const grid = document.getElementById('all-movies-grid');
    const noMoviesElement = document.getElementById('no-all-movies');
    
    // Очищаем сетку
    grid.innerHTML = '';
    
    if (allMovies.length === 0) {
        noMoviesElement.style.display = 'block';
        return;
    }
    
    noMoviesElement.style.display = 'none';
    
    // Добавляем карточки фильмов
    allMovies.forEach(movie => {
        const card = createMovieCard(movie);
        grid.appendChild(card);
    });
}

// Показывает фильмы выбранного жанра
function renderGenreMovies() {
    const grid = document.getElementById('genre-movies-grid');
    const noMoviesElement = document.getElementById('no-genre-movies');
    
    // Очищаем сетку
    grid.innerHTML = '';
    
    // Фильтруем фильмы по выбранному жанру
    const genreMovies = allMovies.filter(movie => 
        movie.genres && movie.genres.includes(selectedGenre)
    );
    
    if (genreMovies.length === 0) {
        noMoviesElement.style.display = 'block';
        return;
    }
    
    noMoviesElement.style.display = 'none';
    
    // Добавляем карточки фильмов
    genreMovies.forEach(movie => {
        const card = createMovieCard(movie);
        grid.appendChild(card);
    });
}

// Выбирает жанр
function selectGenre(genre) {
    // Снимаем выделение со всех кнопок
    document.querySelectorAll('.genre-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Если уже выбран этот жанр - снимаем выбор
    if (selectedGenre === genre) {
        selectedGenre = null;
        document.getElementById('movies-by-genre').style.display = 'none';
        document.getElementById('all-movies-section').style.display = 'block';
        return;
    }
    
    // Выбираем новый жанр
    selectedGenre = genre;
    
    // Подсвечиваем кнопку
    document.querySelectorAll('.genre-btn').forEach(btn => {
        if (btn.textContent === genre) {
            btn.classList.add('active');
        }
    });
    
    // Обновляем интерфейс
    document.getElementById('selected-genre-name').textContent = genre;
    document.getElementById('all-movies-section').style.display = 'none';
    document.getElementById('movies-by-genre').style.display = 'block';
    
    // Показываем фильмы этого жанра
    renderGenreMovies();
}

// Снимает выбор жанра
function clearGenreFilter() {
    selectedGenre = null;
    
    // Снимаем выделение с кнопок
    document.querySelectorAll('.genre-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Показываем все фильмы
    document.getElementById('movies-by-genre').style.display = 'none';
    document.getElementById('all-movies-section').style.display = 'block';
}

// Глобальные функции для вызова из HTML
window.loadGenres = loadData;
window.selectGenre = selectGenre;
window.clearGenreFilter = clearGenreFilter;