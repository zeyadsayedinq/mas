/**
 * Aroma Lounge menu.
 *
 * REAL DATA. Pulled from the live digital menu on 15 September 2026:
 * https://qr.mydigimenu.com/2c44d9f5-1419-40dc-b0f6-c6d85c64d3b6/menu-page
 *
 * 196 items across five menus. Prices are in EGP as published. The source menu
 * also carries an Arabic description for most dishes, which is not included
 * here yet; it is the obvious starting point for an Arabic version of the site.
 *
 * Shisha is served on the terrace but does not appear on the digital menu, so
 * there is no shisha section here rather than invented prices.
 */

export interface MenuItem {
  name: string;
  price: number;
  description?: string;
}

export interface MenuCategory {
  key: string;
  label: string;
  items: MenuItem[];
}

export interface MenuSection {
  key: string;
  label: string;
  note: string;
  categories: MenuCategory[];
}

const c = (key: string, label: string, items: [string, number, string?][]): MenuCategory => ({
  key,
  label,
  items: items.map(([name, price, description]) => ({ name, price, description })),
});

export const MENU: MenuSection[] = [
  {
    key: "food",
    label: "Food",
    note: "Grill, feteer, pasta and the rest of the kitchen.",
    categories: [
      c("main-course", "Main course", [
        ["Aroma Rib Eye Steak", 625, "Premium Angus rib eye, sun dried tomato mashed potato, mixed salad"],
        ["Smoked Angus Brisket", 625, "Premium Angus brisket, slow cooked, creamy mashed potatoes"],
        ["Salmon Lemon Butter", 635, "Grilled salmon / sautéed vegetables / mashed potatoes / lemon butter sauce"],
        ["Aroma Beef Fillet", 610, "Beef fillet (baladi) / potato cubes / mixed green salad / black pepper or mushroom sauce"],
        ["Beef Stroganoff", 610, "Beef slices / stroganoff sauce / mushroom / yellow basmati rice"],
        ["Osso Buco", 595, "Osso buco / safflower lemon demi glace / roasted mushroom / mashed potatoes"],
        ["Seafood Mix Tajin", 495, "A mix of seafood in white sauce, topped with cheese"],
        ["Liver Shish Kebab", 485],
        ["Aroma Grilled Chicken", 425, "Grilled chicken breasts / potato cubes / mushroom sauce / mixed green salad"],
        ["Grilled Chicken Mesahab", 425, "Half chicken / sautéed vegetables / yellow basmati rice / thomeyya"],
        ["Chicken Pastrami Roll", 425],
        ["Meatballs Pot", 420, "Meatballs in brown sauce with vegetables, served with yellow basmati rice"],
        ["Country Fried Chicken", 410],
      ]),
      c("feteer", "Feteer", [
        ["Meshaltet", 520, "Served with cream / molasses / tahini / gebna kadeema"],
        ["Soguk Feteer", 395, "Soguk / mozzarella / roumi cheese / tomatoes / olives / bell pepper"],
        ["Mixed Beef Feteer", 395, "Soguk / ground beef / pastrami / mozzarella / tomatoes"],
        ["Chicken Feteer", 390, "Chicken / mushroom / olives / mozzarella / roumi / cheddar / spinach"],
        ["Basterma Feteer", 390],
        ["Mix Cheese Feteer", 365, "Red cheddar / cream cheese / mozzarella / halloumi / pesto sauce"],
        ["Lotus and Nutella Feteer", 275],
        ["Nutella Marshmallow Feteer", 265, "Nutella / marshmallow / custard / white chocolate flakes"],
        ["Lotus Feteer", 265],
        ["Boghasha Feteer", 260, "Condensed milk / vanilla / hot milk / powdered sugar"],
        ["Custard Feteer Roll", 225],
      ]),
      c("burgers", "Burgers and sandwiches", [
        ["Seafood Mix Sandwich", 365, "Vienna bread / seafood mix / pico de gallo / mayonnaise / ranch sauce / fries"],
        ["Steak Sandwich", 355, "Ciabatta / beef slices / capsicum / onion / cheddar / brown sauce / fries"],
        ["Mushroom Cheeseburger", 335, "Lettuce / tomatoes / pickled cucumber / mushroom sauce / cheese sauce / fries"],
        ["Aroma Chili Burger", 320, "Lettuce / tomatoes / pickled cucumber / jalapeño / chilli sauce / cheese sauce / fries"],
        ["Classic Cheeseburger", 310, "Lettuce / tomatoes / pickled cucumber / cheese sauce / fries"],
        ["Crispy Fried Chicken Bun", 310, "Fried chicken / lettuce / tomatoes / pickled cucumber / pink sauce / ranch / fries"],
        ["Grilled Chicken Wrap", 310, "Tortilla / lettuce / mozzarella / cheddar / carrots / sumac onion / ranch / fries"],
        ["Club Sandwich", 285, "Toast / chicken / eggs / cheddar / smoked turkey / lettuce / tomatoes / mayonnaise / fries"],
        ["Tuna Melt Sandwich", 265, "Toast / capsicum / mustard / capers / mayonnaise / fries"],
      ]),
      c("salads", "Salads", [
        ["Steak Salad", 395, "Grilled steak / arugula / avocado / roasted mushroom / cherry tomatoes / parmesan / gorgonzola dressing"],
        ["Honey Garlic Shrimp Salad", 385, "Shrimps / arugula / cherry tomatoes / roasted capsicum / lettuce / roasted almonds"],
        ["Salmon Salad", 385, "Smoked salmon / lettuce / arugula / cherry tomatoes / pineapple / sumac onion / capers"],
        ["Chicken Caesar Salad", 345],
        ["Chicken Ranch Salad", 335, "Grilled chicken / lettuce / cherry tomatoes / caramelized walnuts / radish / croutons / parmesan"],
        ["Halloumi Avocado Salad", 320, "Halloumi / avocado spread / arugula / lettuce / pico de gallo / radish / pesto / ranch mint dressing"],
        ["Quinoa Salad", 295],
      ]),
      c("appetizers", "Appetizers", [
        ["Beef Quesadilla", 325, "Beef / cheddar / mozzarella / sweet corn / kidney beans / roasted capsicum / sour cream / guacamole"],
        ["Shrimps and Calamari Basket", 320, "Fried shrimps / fried calamari / ranch sauce"],
        ["Chicken Quesadilla", 310, "Chicken / cheddar / mozzarella / sweet corn / kidney beans / roasted capsicum / sour cream / guacamole"],
        ["Hawawshi", 265],
        ["Shrimps Cilantro", 245, "Shrimps / white lemon sauce / cilantro / nachos"],
        ["Chicken Croquettes", 210, "Chicken balls / mozzarella / red cheddar / parmesan / herbs / onion / pink sauce"],
        ["Chicken Liver", 195, "Chicken liver / spinach / roasted almonds / cherry tomatoes / lemon cream sauce / nachos"],
        ["Soguk", 195],
      ]),
      c("pasta", "Pasta and risotto", [
        ["Beef Pesto Fettuccine", 420],
        ["Seafood Fettuccini", 375, "Shrimps / calamari / fish / white sauce / parmesan / sprouts"],
        ["Chicken Penne Alfredo", 340, "Grilled chicken / alfredo sauce / mushroom / parmesan"],
        ["Negresco Fried Chicken", 340],
        ["Meatballs Fettuccini", 310, "Meatballs / Aroma red sauce / parmesan"],
        ["Spaghetti Bolognese", 310, "Bolognese sauce / basil / parmesan"],
        ["Chicken Liver Penne", 285, "Chicken liver / cherry tomatoes / Aroma red sauce / white sauce / sprouts"],
        ["Shrimp Risotto", 520],
        ["Beef Risotto", 520],
        ["Truffle Mushroom Risotto", 450],
      ]),
      c("paella", "Paella", [
        ["Seafood Paella", 590, "Shrimps / calamari / fish / mussels / paella rice / peas / carrots / cilantro / parsley"],
        ["Chicken Paella", 545, "Chicken / paella rice / peas / carrots / cilantro / parsley"],
        ["Vegetables Paella", 410, "Zucchini / broccoli / mushroom / capsicum / paella rice / peas / carrots / cilantro / parsley"],
      ]),
      c("pizza", "Pizza", [
        ["Pizza Chicken Truffle Mushroom", 495],
        ["Shrimp Pizza", 465],
        ["Pizza Quattro Formaggi", 410],
        ["Pizza Pepperoni", 385],
        ["Buffalo Cheese Pizza", 375],
      ]),
      c("soups", "Soups", [
        ["Shrimps Ginger and Carrot Soup", 245, "Shrimps / ginger / carrots / onion / garlic / turmeric / coconut cream"],
        ["Wild Mushroom", 220, "Mushroom soup / pesto sauce"],
        ["Chicken Corn Soup", 210, "Chicken cubes / cream soup / sweet corn / potatoes"],
      ]),
    ],
  },
  {
    key: "beverages",
    label: "Drinks",
    note: "Hot, cold, fresh and blended.",
    categories: [
      c("hot", "Hot drinks", [
        ["Pistachio Latte", 175],
        ["Sahlab", 175],
        ["Spanish Latte", 165],
        ["Salted Caramel Latte", 165],
        ["Health Boost", 155],
        ["Cappuccino Caramel", 145],
        ["Coffee Lotus", 145],
        ["Homoss Elsham", 145],
        ["White Mocha", 145],
        ["Espresso Double", 145],
        ["Cappuccino", 140],
        ["Cafe Latte", 135],
        ["Cafe Mocha", 135],
        ["Aroma Gold", 135],
        ["Apple Cider", 135],
        ["Hot Chocolate", 135],
        ["Nutella Coffee", 125],
        ["American Coffee", 120],
        ["Cinnamon Milk", 110],
        ["Espresso", 95],
        ["Turkish Coffee (Mehawweg)", 95],
        ["Turkish Coffee", 90],
        ["Tea", 85],
        ["Herbs", 70],
      ]),
      c("cold", "Cold drinks", [
        ["Redbull Mix Berries", 180],
        ["Iced Salted Caramel Latte", 175],
        ["Mojito Passion Fruit", 175],
        ["Pistachio Ice Latte", 175],
        ["Cookies Ice Latte", 165],
        ["Kiwi Lemonade", 165],
        ["Iced Spanish Latte", 165],
        ["Iced White Mocha Latte", 165],
        ["Mocha Frappe", 165],
        ["Latte Frappe", 160],
        ["Ice Caramel Macchiato", 155],
        ["Sunshine", 145],
        ["Ice Chocolate", 145],
        ["Oreo Shake", 145],
        ["Milkshake", 145],
        ["Apple Angel", 145],
        ["Ice Latte", 145],
        ["Ice Tea", 140, "Peach, passion fruit, apple or coconut"],
        ["Cherry Cola", 125],
      ]),
      c("matcha", "Matcha", [
        ["Hot Pistachio Matcha", 175],
        ["Iced Spanish Matcha", 170],
        ["Spanish Matcha", 165],
        ["Salted Caramel Matcha", 165],
        ["Iced Strawberry Matcha", 160],
        ["Blended Pistachio Matcha", 160],
        ["Hot Matcha", 155],
        ["Iced Mango Vanilla Matcha", 155],
      ]),
      c("juices", "Juices and smoothies", [
        ["Fresh Avocado Cocktail", 195],
        ["Pina Colada", 185],
        ["Banana Berries", 185],
        ["Mango Colada", 185],
        ["Strawberry Colada", 185],
        ["Fresh Kiwi Cocktail", 175],
        ["Mango Smoothie", 175],
        ["Lemon Mint", 165],
        ["Strawberries Smoothie", 165],
        ["Orange Strawberries", 165],
        ["Watermelon Smoothie", 165],
        ["Fresh Mango Juice", 155],
        ["Fresh Lemon Juice", 145],
        ["Fresh Orange Juice", 145],
        ["Fresh Strawberry Juice", 145],
        ["Fresh Guava Juice", 145],
        ["Fresh Fig", 145],
        ["Banana and Milk", 145],
      ]),
      c("yogurt", "Yogurt mixes", [
        ["Mix Berry", 185],
        ["Strawberries", 175],
        ["Peach", 175],
        ["Honey", 165],
      ]),
      c("soft", "Soft drinks and water", [
        ["Red Bull", 125],
        ["Fayrouz Pineapple", 85],
        ["Birel", 85, "Non alcoholic"],
        ["Sparkling Water", 85],
        ["Pepsi", 80],
        ["Diet Pepsi", 80],
        ["7 Up", 80],
        ["Mirinda Orange", 80],
        ["Water (large)", 60],
        ["Water (small)", 45],
      ]),
    ],
  },
  {
    key: "breakfast",
    label: "Breakfast",
    note: "Oriental trays, eggs and benedicts, served through the morning.",
    categories: [
      c("breakfast", "Breakfast", [
        ["Full Oriental Breakfast Tray", 550, "Feteer meshaltet / foul / eggs / tameyya / gebna beida / labna / salad / molasses / gebna adeema"],
        ["Oriental Breakfast Tray", 450, "Foul / eggs / tameyya / gebna beida / labna / salad"],
        ["Salmon Avocado Omelet", 310, "Smoked salmon, avocado, capers, labna, onion and sumac, with herb potato cubes and salad"],
        ["Smoked Salmon Eggs Benedict", 310, "Two poached eggs, smoked salmon, arugula, avocado, spinach and hollandaise"],
        ["Avocado and Beef Bacon Benedict", 295, "Two poached eggs, beef bacon, arugula, guacamole and hollandaise"],
        ["Mushroom Cheese Spinach Omelet", 295, "Cheddar, fresh mushroom, spinach and cherry tomatoes, with herb potato cubes and salad"],
        ["Pastrami Eggs Casserole", 295, "Sunny side up eggs with pastrami, tomatoes and arugula"],
        ["Smoked Turkey Benedict", 285, "Two poached eggs, smoked turkey, mayonnaise, arugula, sun dried tomatoes and hollandaise"],
        ["Hash Brown Eggs and Cheese Casserole", 280, "Eggs with feta, fries, broccoli and tomatoes"],
        ["Egg White Cheese and Olives Omelet", 275, "Feta, black olives, mushroom and bell pepper, with herb potato cubes and salad"],
        ["Eggs Shakshooka Casserole", 275, "Sunny side up eggs with oriental shakshooka mix"],
        ["Focaccia Spanish Egg", 275],
        ["Flat Bread, Smoked Salmon and Cheese", 275, "Flat bread with cream cheese, smoked salmon and capers"],
        ["Chicken Ranch Croissant", 265],
        ["Flat Bread, Minced Beef and Eggs", 255, "Flat bread with herbed minced beef, eggs and parsley"],
        ["Turkey Omelette Croissant", 245],
        ["Flat Bread, Beef Bacon and Eggs", 245, "Flat bread with beef bacon, cherry tomatoes and eggs"],
        ["Omelette Hot Dogs Croissant", 235],
        ["Mixed Cheese Croissant", 220],
      ]),
    ],
  },
  {
    key: "dessert",
    label: "Dessert",
    note: "Pancakes, waffles and the pastry counter.",
    categories: [
      c("dessert", "Dessert", [
        ["Four Seasons Waffle", 285],
        ["Cream Brûlée French Toast", 255],
        ["Oreo Ice Cream Waffle", 250],
        ["Waffle Croissant", 250, "Make your own: pistachio, Nutella or strawberry"],
        ["Pistachio Pancake", 235],
        ["Nutella Ice Cream Pancake", 230],
        ["Chocolate Lava Cake with Ice Cream", 225],
        ["Nutella Pancake", 220],
        ["Lotus Pancake", 210],
        ["Blueberry Cheesecake", 190],
        ["Strawberry Cheesecake", 185],
        ["Chocolate Fudge", 180],
        ["Tiramisu", 180],
        ["Eclair Nutella", 165],
        ["Eclair Caramel", 160],
        ["Om Ali", 135],
        ["Ice Cream", 95, "French vanilla, chocolate, strawberry or mango"],
      ]),
    ],
  },
  {
    key: "kids",
    label: "Kids",
    note: "Smaller plates for the table's youngest.",
    categories: [
      c("kids", "Kids", [
        ["Pasta Meatballs", 210],
        ["Pasta Crispy Chicken", 210],
        ["Chicken Strips", 185],
      ]),
    ],
  },
];

/** Every item across every menu, for search. */
export const ALL_ITEMS: (MenuItem & { section: string; category: string })[] =
  MENU.flatMap((s) =>
    s.categories.flatMap((cat) =>
      cat.items.map((i) => ({ ...i, section: s.label, category: cat.label })),
    ),
  );
