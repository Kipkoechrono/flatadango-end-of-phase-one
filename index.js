// Event listener to load entire DOM before running the script
document.addEventListener("DOMContentLoaded", () => {
    // Get references to the HTML elements by their IDs
    const movieList = document.getElementById("movies");
    const poster = document.getElementById("poster");
    const title = document.getElementById("title");
    const runtime = document.getElementById("runtime");
    const showtime = document.getElementById("showtime");
    const ticketsAvailable = document.getElementById("tickets-available");
    const buyTicketButton = document.getElementById("buy-ticket");
  
    // Variable to keep track of the currently displayed movie
    let showingMovie;
  
    // Function to fetch all movies from the server
    function fetchMovies() {
      fetch("http://localhost:3000/movies")
        .then((response) => response.json())
        .then((movies) => {
          // Iterate over each movie and create a list item for it
          movies.forEach((movie) => {
            const li = document.createElement("li");
            li.textContent = movie.title; // Set the text content to the movie title
            li.classList.add("movie", "item"); // Add CSS classes for styling
            // Check if the movie is sold out
            if (movie.capacity - movie.tickets_sold === 0) {
              li.classList.add("sold-out"); // Add a sold-out class if no tickets are available
            }
            // Add an event listener to load movie details when clicked
            li.addEventListener("click", () => loadmovieDetails(movie));
            // Append the list item to the movies list
            movieList.appendChild(li);
          });
  
          // Load details of the first movie by default
          if (movies.length > 0) {
            loadmovieDetails(movies[0]);
          }
        });
    }
  
    // Function to update the display of available tickets
    function updateTicketsAvailable() {
      const availableTickets = showingMovie.capacity - showingMovie.tickets_sold; // Calculate available tickets
      ticketsAvailable.textContent = `Tickets Available: ${availableTickets}`;  // Update the text content
  
      if (availableTickets > 0) {
        buyTicketButton.disabled = false; // Enable the button if tickets are available
        buyTicketButton.textContent = "Buy Ticket"; // Set button text
      } else {
        buyTicketButton.disabled = true; // Disable the button if no tickets are available
        buyTicketButton.textContent = "Sold Out"; // Set button text
      }
    }
    // Event listener for the "Buy Ticket" button
    buyTicketButton.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent the default form submission behavior
      if (showingMovie.tickets_sold < showingMovie.capacity) {
        showingMovie.tickets_sold += 1; // Increment the number of tickets sold
        updateTicketsAvailable(); // Update the number of available tickets
        updatemovieList(showingMovie); // Update the movie list to reflect changes
      }
    });
  
    // Function to load and display details of a specific movie
    function loadmovieDetails(movie) {
      showingMovie = movie; // Set the current movie to the selected movie
      poster.src = movie.poster; // Update the poster image
      title.textContent = `Title: ${movie.title}`; // Update the title
      runtime.textContent = `Runtime: ${movie.runtime} minutes`;// Update the runtime
      showtime.textContent =`Showtime: ${movie.showtime}`; // Update the showtime
      updateTicketsAvailable(); // Update the number of available tickets
    }
  
    // Function to update the movie list
    function updatemovieList(updatedmovie) {
      const movieItems = movieList.getElementsByClassName("item"); // Get all movie items
      for (let movieItem of movieItems) {
        if (movieItem.textContent === updatedmovie.title) {
          if (updatedmovie.capacity - updatedmovie.tickets_sold === 0) {
            movieItem.classList.add("sold-out"); // Add sold-out class if no tickets are available
          } else {
            movieItem.classList.remove("sold-out"); // Remove sold-out class if tickets are available
          }
        }
      }
    }
  
    // Fetch all movies when the page loads
    fetchMovies();
  });