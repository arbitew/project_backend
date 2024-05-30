let index_eat = satiety; 
let circlex = document.querySelector(".circle");
if(index_eat >= 80){
    circlex.style.backgroundColor = "green";
}
else if(index_eat >= 50 && index_eat < 80){
    circlex.style.backgroundColor = "yellow";
}
else{
    circlex.style.backgroundColor = "red";
}

console.log(satiety);