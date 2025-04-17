// Shop Module for Mental Gamble

let tokens = 0;
let luckBoost = 0;
let cooldown = 5000; // Default 5s cooldown
let cooldownCost = 50; // Initial cost for cooldown reduction
let luckQuantity = 1;
let cooldownQuantity = 1;
let currentCooldownLevel = 0; // Track the level of cooldown reduction purchased

// Initialize the shop UI
function initializeShop() {
  const shopIcon = document.createElement("div");
  shopIcon.className = "shop-icon";
  shopIcon.onclick = toggleShop;
  document.querySelector(".container").appendChild(shopIcon);
  
  // Create and append the shop panel
  const shopPanel = document.createElement("div");
  shopPanel.className = "shop-panel";
  shopPanel.id = "shop";
  shopPanel.innerHTML = `
    <h2>Shop</h2>
    <div class="shop-item">
      <span>+10% Luck Boost (50 tokens)</span>
      <div class="quantity">
        <button onclick="changeLuckQuantity(-1)">-</button>
        <span id="luckQuantity">1</span>
        <button onclick="changeLuckQuantity(1)">+</button>
      </div>
      <button id="luckButton" onclick="buyLuck()">Buy</button>
    </div>
    <div class="shop-item">
      <span id="cooldownCostText">Reduce Cooldown by 1s (50 tokens)</span>
      <div class="quantity">
        <button onclick="changeCooldownQuantity(-1)">-</button>
        <span id="cooldownQuantity">1</span>
        <button onclick="changeCooldownQuantity(1)">+</button>
      </div>
      <button id="cooldownButton" onclick="buyCooldown()">Buy</button>
    </div>
    <button class="button" onclick="toggleShop()">Close Shop</button>
  `;
  document.body.appendChild(shopPanel);
  
  // Add shop CSS styles
  addShopStyles();
}

// Add shop-specific CSS styles
function addShopStyles() {
  const shopStyles = document.createElement("style");
  shopStyles.textContent = `
    .shop-icon {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 48px;
      height: 48px;
      background: url('https://img.icons8.com/ios-filled/50/shop.png') no-repeat center/contain;
      cursor: pointer;
      transition: transform 0.3s ease;
    }
    
    .shop-icon:hover {
      transform: scale(1.1);
    }

    .shop-panel {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(255, 255, 255, 0.95);
      z-index: 10;
      padding: 40px;
      display: none;
      flex-direction: column;
      overflow-y: auto;
      align-items: center;
      justify-content: center;
    }

    .shop-panel h2 {
      margin-bottom: 20px;
      font-size: 28px;
      color: #333;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
    }

    .shop-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 80%;
      padding: 15px;
      margin: 10px 0;
      border-radius: 12px;
      background: #f2f2f2;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      font-size: 18px;
      transition: transform 0.2s ease;
    }
    
    .shop-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }
    
    .shop-item .quantity {
      display: flex;
      align-items: center;
    }
    
    .shop-item .quantity button {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: none;
      background: #ddd;
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s ease;
    }
    
    .shop-item .quantity button:hover {
      background: #ccc;
    }
    
    .shop-item .quantity span {
      margin: 0 10px;
      font-size: 18px;
    }

    .shop-item button {
      background: #ffaa00;
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      color: white;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.2s ease, transform 0.2s ease;
    }

    .shop-item button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .shop-item button:hover:enabled {
      background: #cc8800;
      transform: translateY(-2px);
    }
    
    .shop-item button:active:enabled {
      transform: translateY(1px);
    }

    .shop-panel .button {
      background: #444;
      color: white;
      margin-top: 20px;
      padding: 12px 30px;
      transition: background 0.2s ease, transform 0.2s ease;
    }

    .shop-panel .button:hover {
      background: #222;
      transform: translateY(-2px);
    }
    
    .shop-item-purchase {
      animation: purchaseAnimation 0.5s ease;
    }
    
    @keyframes purchaseAnimation {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); background: rgba(76, 175, 80, 0.2); }
      100% { transform: scale(1); }
    }
  `;
  document.head.appendChild(shopStyles);
}

// Toggle shop visibility
function toggleShop() {
  const shop = document.getElementById("shop");
  shop.style.display = shop.style.display === "flex" ? "none" : "flex";
  
  if (shop.style.display === "flex") {
    updateShopDisplay();
  }
}

// Update shop display based on current values
function updateShopDisplay() {
  document.getElementById("cooldownCostText").textContent = `Reduce Cooldown by 1s (${cooldownCost} tokens)`;
  document.getElementById("luckQuantity").textContent = luckQuantity;
  document.getElementById("cooldownQuantity").textContent = cooldownQuantity;

  const luckButton = document.getElementById("luckButton");
  luckButton.disabled = tokens < (50 * luckQuantity);

  const cooldownButton = document.getElementById("cooldownButton");
  cooldownButton.disabled = tokens < (cooldownCost * cooldownQuantity);
}

// Change luck purchase quantity
function changeLuckQuantity(amount) {
  luckQuantity = Math.max(1, luckQuantity + amount);
  updateShopDisplay();
}

// Change cooldown purchase quantity
function changeCooldownQuantity(amount) {
  cooldownQuantity = Math.max(1, cooldownQuantity + amount);
  updateShopDisplay();
}

// Buy luck boost
function buyLuck() {
  const cost = 50 * luckQuantity;
  if (tokens >= cost) {
    tokens -= cost;
    luckBoost += 10 * luckQuantity;
    
    // Show purchase animation
    const luckItem = document.querySelector(".shop-item:first-child");
    luckItem.classList.add("shop-item-purchase");
    setTimeout(() => luckItem.classList.remove("shop-item-purchase"), 500);
    
    showNotification(`Purchased ${luckQuantity} Luck Boost(s)! +${10 * luckQuantity}% Luck`, "success");
    updateShopDisplay();
    updateGameDisplay();
    
    // Show token change animation
    showTokenChange(-cost);
  } else {
    showNotification("Not enough tokens!", "error");
  }
}

// Buy cooldown reduction
function buyCooldown() {
  const cost = cooldownCost * cooldownQuantity;
  if (tokens >= cost) {
    tokens -= cost;
    const oldCooldown = cooldown;
    cooldown = Math.max(0, cooldown - (1000 * cooldownQuantity));
    currentCooldownLevel += cooldownQuantity;
    
    // Show purchase animation
    const cooldownItem = document.querySelector(".shop-item:nth-child(2)");
    cooldownItem.classList.add("shop-item-purchase");
    setTimeout(() => cooldownItem.classList.remove("shop-item-purchase"), 500);
    
    showNotification(`Reduced cooldown by ${cooldownQuantity}s! (${oldCooldown/1000}s → ${cooldown/1000}s)`, "success");
    
    // Update cooldown cost based on level
    updateCooldownCost();
    updateShopDisplay();
    updateGameDisplay();
    
    // Show token change animation
    showTokenChange(-cost);
  } else {
    showNotification("Not enough tokens!", "error");
  }
}

// Update cooldown cost based on current level
function updateCooldownCost() {
  if (currentCooldownLevel >= 1 && currentCooldownLevel < 2) {
    cooldownCost = 100;
  } else if (currentCooldownLevel >= 2 && currentCooldownLevel < 3) {
    cooldownCost = 200;
  } else if (currentCooldownLevel >= 3 && currentCooldownLevel < 4) {
    cooldownCost = 400;
  } else if (currentCooldownLevel >= 4) {
    cooldownCost = 650;
  }
}

// Update game display with shop-related values
function updateGameDisplay() {
  document.getElementById("tokenCount").textContent = `Tokens: ${tokens}`;
  document.getElementById("luckDisplay").textContent = `Luck Boost: ${luckBoost}%`;
}

// The main game can access these functions
window.toggleShop = toggleShop;
window.changeLuckQuantity = changeLuckQuantity;
window.changeCooldownQuantity = changeCooldownQuantity;
window.buyLuck = buyLuck;
window.buyCooldown = buyCooldown;

// Initialize shop when the page loads
document.addEventListener("DOMContentLoaded", function() {
  initializeShop();
});
