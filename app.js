document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'https://api.nytimes.com/svc/books/v3/lists/2019-01-20/hardcover-fiction.json?api-key=QTd4H7HDVpLKhqIqtV42NmAthrt8ub4b';
    const bookList = document.getElementById('book-list');
    const searchInput = document.getElementById('search');
    const sortSelect = document.getElementById('sort');
    const genreFilter = document.getElementById('filter-genre');
    const authorFilter = document.getElementById('filter-author');
    const dateFilter = document.getElementById('filter-date');
    const paginationDiv = document.getElementById('pagination');
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    const modalClose = document.getElementById('modal-close');

    let books = [];
    let currentPage = 1;
    const itemsPerPage = 6;

    // Fetch books from API
    function fetchBooks() {
        loadingDiv.classList.remove('hidden');
        errorDiv.classList.add('hidden');
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                books = data.results.books.map(book => ({
                    title: book.title,
                    author: book.author,
                    description: book.description,
                    date: book.published_date,
                    genre: 'fiction', // Example static genre, replace with dynamic data if available
                    rating: Math.floor(Math.random() * 5) + 1 // Example static rating, replace with dynamic data if available
                }));
                displayBooks();
                setupPagination();
            })
            .catch(error => {
                console.error('Error fetching books:', error);
                errorDiv.textContent = 'An error occurred while fetching data.';
                errorDiv.classList.remove('hidden');
            })
            .finally(() => {
                loadingDiv.classList.add('hidden');
            });
    }

    // Display books in the list
    function displayBooks() {
        bookList.innerHTML = '';

        const filteredBooks = filterAndSortBooks();
        const paginatedBooks = paginateBooks(filteredBooks);

        paginatedBooks.forEach(book => {
            const bookElement = document.createElement('div');
            bookElement.className = 'card p-4';
            bookElement.innerHTML = `
                <h2 class="text-2xl font-bold mb-2 text-purple-700">${book.title}</h2>
                <p class="text-md mb-1"><strong>Author:</strong> ${book.author}</p>
                <p class="text-md mb-1"><strong>Published Date:</strong> ${book.date}</p>
                <p class="text-md mb-1"><strong>Genre:</strong> ${book.genre}</p>
                <p class="text-md mb-1"><strong>Rating:</strong> ${'★'.repeat(book.rating)}</p>
            `;
            bookElement.addEventListener('click', () => openModal(book));
            bookList.appendChild(bookElement);
        });
    }

    // Open modal with book details
    function openModal(book) {
        modalContent.innerHTML = `
            <h2 class="text-3xl font-bold mb-4">${book.title}</h2>
            <p class="text-md mb-2"><strong>Author:</strong> ${book.author}</p>
            <p class="text-md mb-2"><strong>Published Date:</strong> ${book.date}</p>
            <p class="text-md mb-2"><strong>Genre:</strong> ${book.genre}</p>
            <p class="text-md mb-2"><strong>Rating:</strong> ${'★'.repeat(book.rating)}</p>
            <p class="text-md mb-2"><strong>Description:</strong> ${book.description}</p>
            <p class="text-md mb-2"><strong>ISBN:</strong> [ISBN here]</p> <!-- Add ISBN if available -->
        `;
        modal.classList.remove('hidden');
    }

    // Close modal
    modalClose.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Filter and sort books based on user input
    function filterAndSortBooks() {
        let filteredBooks = books;

        // Filter by search term
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filteredBooks = filteredBooks.filter(book =>
                book.title.toLowerCase().includes(searchTerm)
            );
        }

        // Filter by genre
        const genre = genreFilter.value;
        if (genre) {
            filteredBooks = filteredBooks.filter(book => book.genre === genre);
        }

        // Filter by author
        const author = authorFilter.value.toLowerCase();
        if (author) {
            filteredBooks = filteredBooks.filter(book =>
                book.author.toLowerCase().includes(author)
            );
        }

        // Filter by date
        const date = dateFilter.value;
        if (date) {
            filteredBooks = filteredBooks.filter(book =>
                new Date(book.date) >= new Date(date)
            );
        }

        // Sort by selected criteria
        const sortBy = sortSelect.value;
        filteredBooks.sort((a, b) => {
            if (sortBy === 'title') {
                return a.title.localeCompare(b.title);
            } else if (sortBy === 'author') {
                return a.author.localeCompare(b.author);
            } else if (sortBy === 'date') {
                return new Date(b.date) - new Date(a.date);
            } else if (sortBy === 'rating') {
                return b.rating - a.rating;
            }
        });

        return filteredBooks;
    }

    // Paginate books
    function paginateBooks(filteredBooks) {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredBooks.slice(startIndex, endIndex);
    }

    // Setup pagination
    function setupPagination() {
        paginationDiv.innerHTML = '';

        const totalPages = Math.ceil(books.length / itemsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.className = `pagination-btn ${i === currentPage ? 'bg-purple-500' : 'bg-gray-700'}`;
            pageButton.addEventListener('click', () => {
                currentPage = i;
                displayBooks();
            });
            paginationDiv.appendChild(pageButton);
        }
    }

    // Event listeners
    searchInput.addEventListener('input', () => {
        currentPage = 1;
        displayBooks();
        setupPagination();
    });

    sortSelect.addEventListener('change', () => {
        currentPage = 1;
        displayBooks();
        setupPagination();
    });

    genreFilter.addEventListener('change', () => {
        currentPage = 1;
        displayBooks();
        setupPagination();
    });

    authorFilter.addEventListener('input', () => {
        currentPage = 1;
        displayBooks();
        setupPagination();
    });

    dateFilter.addEventListener('input', () => {
        currentPage = 1;
        displayBooks();
        setupPagination();
    });

    // Fetch books on page load
    fetchBooks();
});
