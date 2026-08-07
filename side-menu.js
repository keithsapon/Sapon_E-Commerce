// Toggle Side Menu
function toggleMenu(){
    document.querySelector(".sidebar").classList.toggle("hide");
}

// Change Active Menu
const menus = document.querySelectorAll(".menu");

menus.forEach(menu => {
    menu.addEventListener("click", function(){

        menus.forEach(item => item.classList.remove("active"));

        this.classList.add("active");
    });
});

// Logout Alert
document.getElementById("logout").addEventListener("click", function(event){

    event.preventDefault();

    alert("You have successfully logged out!");

});