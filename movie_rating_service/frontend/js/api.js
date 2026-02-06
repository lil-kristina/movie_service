// Базовый URL вашего бэкенда
const API_BASE_URL = 'http://localhost:8000/api';

// Объект для работы с API
const api = {
    // Получить все фильмы
    async getMovies() {
        try {
            const response = await fetch(`${API_BASE_URL}/movies/`);
            if (!response.ok) throw new Error('Ошибка загрузки фильмов');
            return await response.json();
        } catch (error) {
            console.error('Ошибка при загрузке фильмов:', error);
            throw error;
        }
    },

    // Получить все жанры
    async getGenres() {
        try {
            const response = await fetch(`${API_BASE_URL}/genres/`);
            if (!response.ok) throw new Error('Ошибка загрузки жанров');
            return await response.json();
        } catch (error) {
            console.error('Ошибка при загрузке жанров:', error);
            throw error;
        }
    },

    // Создать фильм
    async createMovie(movieData) {
        try {
            const response = await fetch(`${API_BASE_URL}/movies/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(movieData)
            });
            if (!response.ok) throw new Error('Ошибка создания фильма');
            return await response.json();
        } catch (error) {
            console.error('Ошибка при создании фильма:', error);
            throw error;
        }
    },

    // Обновить фильм
    async updateMovie(id, movieData) {
        try {
            const response = await fetch(`${API_BASE_URL}/movies/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(movieData)
            });
            if (!response.ok) throw new Error('Ошибка обновления фильма');
            return await response.json();
        } catch (error) {
            console.error('Ошибка при обновлении фильма:', error);
            throw error;
        }
    },

    // Удалить фильм
    async deleteMovie(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/movies/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Ошибка удаления фильма');
            return await response.json();
        } catch (error) {
            console.error('Ошибка при удалении фильма:', error);
            throw error;
        }
    }
};