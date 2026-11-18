let health = 100;

const items = [
    { name: "Dagger", damage: 10 },
    { name: "Sword", damage: 25 }
];
let currentItem = 0;

const enemies = [];
function listEnemies() {
    console.table(enemies);
}

function damageHealth(amount) {
    health -= amount;
    console.log("Health: " + health);
    document.getElementById("healthText").innerHTML = "Health: " + health;
}

function spawnEnemy(name, health, damage) {
    console.log(name, "Health: " + health + ", Damage: " + damage);
    enemies.push({ name: name, health: health, damage: damage });
    listEnemies();
}

function damageEnemy(enemy) {
    enemy.health -= items[currentItem].damage;
    listEnemies();
}






listEnemies();
spawnEnemy("Goblin", 50, 10);