/**
 * Aroma Lounge menu.
 *
 * REAL DATA. Pulled from the live digital menu on 15 September 2026:
 * https://qr.mydigimenu.com/2c44d9f5-1419-40dc-b0f6-c6d85c64d3b6/menu-page
 *
 * 196 items across five menus. Prices are deliberately not kept: the site
 * shows no prices anywhere. The source menu
 * also carries an Arabic description for most dishes, which is not included
 * here yet; it is the obvious starting point for an Arabic version of the site.
 *
 * Shisha is served on the terrace but does not appear on the digital menu, so
 * there is no shisha section here.
 */

export interface MenuItem {
  name: string;
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

const c = (key: string, label: string, items: [string, string?][]): MenuCategory => ({
  key,
  label,
  items: items.map(([name, description]) => ({ name, description })),
});

export const MENU: MenuSection[] = [
  {
    key: "food",
    label: "Food",
    note: "Grill, feteer, pasta and the rest of the kitchen.",
    categories: [
      c("main-course", "Main course", [
        ["Aroma Rib Eye Steak", "Premium Angus rib eye, sun dried tomato mashed potato, mixed salad"],
        ["Smoked Angus Brisket", "Premium Angus brisket, slow cooked, creamy mashed potatoes"],
        ["Salmon Lemon Butter", "Grilled salmon / sautéed vegetables / mashed potatoes / lemon butter sauce"],
        ["Aroma Beef Fillet", "Beef fillet (baladi) / potato cubes / mixed green salad / black pepper or mushroom sauce"],
        ["Beef Stroganoff", "Beef slices / stroganoff sauce / mushroom / yellow basmati rice"],
        ["Osso Buco", "Osso buco / safflower lemon demi glace / roasted mushroom / mashed potatoes"],
        ["Seafood Mix Tajin", "A mix of seafood in white sauce, topped with cheese"],
        ["Liver Shish Kebab"],
        ["Aroma Grilled Chicken", "Grilled chicken breasts / potato cubes / mushroom sauce / mixed green salad"],
        ["Grilled Chicken Mesahab", "Half chicken / sautéed vegetables / yellow basmati rice / thomeyya"],
        ["Chicken Pastrami Roll"],
        ["Meatballs Pot", "Meatballs in brown sauce with vegetables, served with yellow basmati rice"],
        ["Country Fried Chicken"],
      ]),
      c("feteer", "Feteer", [
        ["Meshaltet", "Served with cream / molasses / tahini / gebna kadeema"],
        ["Soguk Feteer", "Soguk / mozzarella / roumi cheese / tomatoes / olives / bell pepper"],
        ["Mixed Beef Feteer", "Soguk / ground beef / pastrami / mozzarella / tomatoes"],
        ["Chicken Feteer", "Chicken / mushroom / olives / mozzarella / roumi / cheddar / spinach"],
        ["Basterma Feteer"],
        ["Mix Cheese Feteer", "Red cheddar / cream cheese / mozzarella / halloumi / pesto sauce"],
        ["Lotus and Nutella Feteer"],
        ["Nutella Marshmallow Feteer", "Nutella / marshmallow / custard / white chocolate flakes"],
        ["Lotus Feteer"],
        ["Boghasha Feteer", "Condensed milk / vanilla / hot milk / powdered sugar"],
        ["Custard Feteer Roll"],
      ]),
      c("burgers", "Burgers and sandwiches", [
        ["Seafood Mix Sandwich", "Vienna bread / seafood mix / pico de gallo / mayonnaise / ranch sauce / fries"],
        ["Steak Sandwich", "Ciabatta / beef slices / capsicum / onion / cheddar / brown sauce / fries"],
        ["Mushroom Cheeseburger", "Lettuce / tomatoes / pickled cucumber / mushroom sauce / cheese sauce / fries"],
        ["Aroma Chili Burger", "Lettuce / tomatoes / pickled cucumber / jalapeño / chilli sauce / cheese sauce / fries"],
        ["Classic Cheeseburger", "Lettuce / tomatoes / pickled cucumber / cheese sauce / fries"],
        ["Crispy Fried Chicken Bun", "Fried chicken / lettuce / tomatoes / pickled cucumber / pink sauce / ranch / fries"],
        ["Grilled Chicken Wrap", "Tortilla / lettuce / mozzarella / cheddar / carrots / sumac onion / ranch / fries"],
        ["Club Sandwich", "Toast / chicken / eggs / cheddar / smoked turkey / lettuce / tomatoes / mayonnaise / fries"],
        ["Tuna Melt Sandwich", "Toast / capsicum / mustard / capers / mayonnaise / fries"],
      ]),
      c("salads", "Salads", [
        ["Steak Salad", "Grilled steak / arugula / avocado / roasted mushroom / cherry tomatoes / parmesan / gorgonzola dressing"],
        ["Honey Garlic Shrimp Salad", "Shrimps / arugula / cherry tomatoes / roasted capsicum / lettuce / roasted almonds"],
        ["Salmon Salad", "Smoked salmon / lettuce / arugula / cherry tomatoes / pineapple / sumac onion / capers"],
        ["Chicken Caesar Salad"],
        ["Chicken Ranch Salad", "Grilled chicken / lettuce / cherry tomatoes / caramelized walnuts / radish / croutons / parmesan"],
        ["Halloumi Avocado Salad", "Halloumi / avocado spread / arugula / lettuce / pico de gallo / radish / pesto / ranch mint dressing"],
        ["Quinoa Salad"],
      ]),
      c("appetizers", "Appetizers", [
        ["Beef Quesadilla", "Beef / cheddar / mozzarella / sweet corn / kidney beans / roasted capsicum / sour cream / guacamole"],
        ["Shrimps and Calamari Basket", "Fried shrimps / fried calamari / ranch sauce"],
        ["Chicken Quesadilla", "Chicken / cheddar / mozzarella / sweet corn / kidney beans / roasted capsicum / sour cream / guacamole"],
        ["Hawawshi"],
        ["Shrimps Cilantro", "Shrimps / white lemon sauce / cilantro / nachos"],
        ["Chicken Croquettes", "Chicken balls / mozzarella / red cheddar / parmesan / herbs / onion / pink sauce"],
        ["Chicken Liver", "Chicken liver / spinach / roasted almonds / cherry tomatoes / lemon cream sauce / nachos"],
        ["Soguk"],
      ]),
      c("pasta", "Pasta and risotto", [
        ["Beef Pesto Fettuccine"],
        ["Seafood Fettuccini", "Shrimps / calamari / fish / white sauce / parmesan / sprouts"],
        ["Chicken Penne Alfredo", "Grilled chicken / alfredo sauce / mushroom / parmesan"],
        ["Negresco Fried Chicken"],
        ["Meatballs Fettuccini", "Meatballs / Aroma red sauce / parmesan"],
        ["Spaghetti Bolognese", "Bolognese sauce / basil / parmesan"],
        ["Chicken Liver Penne", "Chicken liver / cherry tomatoes / Aroma red sauce / white sauce / sprouts"],
        ["Shrimp Risotto"],
        ["Beef Risotto"],
        ["Truffle Mushroom Risotto"],
      ]),
      c("paella", "Paella", [
        ["Seafood Paella", "Shrimps / calamari / fish / mussels / paella rice / peas / carrots / cilantro / parsley"],
        ["Chicken Paella", "Chicken / paella rice / peas / carrots / cilantro / parsley"],
        ["Vegetables Paella", "Zucchini / broccoli / mushroom / capsicum / paella rice / peas / carrots / cilantro / parsley"],
      ]),
      c("pizza", "Pizza", [
        ["Pizza Chicken Truffle Mushroom"],
        ["Shrimp Pizza"],
        ["Pizza Quattro Formaggi"],
        ["Pizza Pepperoni"],
        ["Buffalo Cheese Pizza"],
      ]),
      c("soups", "Soups", [
        ["Shrimps Ginger and Carrot Soup", "Shrimps / ginger / carrots / onion / garlic / turmeric / coconut cream"],
        ["Wild Mushroom", "Mushroom soup / pesto sauce"],
        ["Chicken Corn Soup", "Chicken cubes / cream soup / sweet corn / potatoes"],
      ]),
    ],
  },
  {
    key: "beverages",
    label: "Drinks",
    note: "Hot, cold, fresh and blended.",
    categories: [
      c("hot", "Hot drinks", [
        ["Pistachio Latte"],
        ["Sahlab"],
        ["Spanish Latte"],
        ["Salted Caramel Latte"],
        ["Health Boost"],
        ["Cappuccino Caramel"],
        ["Coffee Lotus"],
        ["Homoss Elsham"],
        ["White Mocha"],
        ["Espresso Double"],
        ["Cappuccino"],
        ["Cafe Latte"],
        ["Cafe Mocha"],
        ["Aroma Gold"],
        ["Apple Cider"],
        ["Hot Chocolate"],
        ["Nutella Coffee"],
        ["American Coffee"],
        ["Cinnamon Milk"],
        ["Espresso"],
        ["Turkish Coffee (Mehawweg)"],
        ["Turkish Coffee"],
        ["Tea"],
        ["Herbs"],
      ]),
      c("cold", "Cold drinks", [
        ["Redbull Mix Berries"],
        ["Iced Salted Caramel Latte"],
        ["Mojito Passion Fruit"],
        ["Pistachio Ice Latte"],
        ["Cookies Ice Latte"],
        ["Kiwi Lemonade"],
        ["Iced Spanish Latte"],
        ["Iced White Mocha Latte"],
        ["Mocha Frappe"],
        ["Latte Frappe"],
        ["Ice Caramel Macchiato"],
        ["Sunshine"],
        ["Ice Chocolate"],
        ["Oreo Shake"],
        ["Milkshake"],
        ["Apple Angel"],
        ["Ice Latte"],
        ["Ice Tea", "Peach, passion fruit, apple or coconut"],
        ["Cherry Cola"],
      ]),
      c("matcha", "Matcha", [
        ["Hot Pistachio Matcha"],
        ["Iced Spanish Matcha"],
        ["Spanish Matcha"],
        ["Salted Caramel Matcha"],
        ["Iced Strawberry Matcha"],
        ["Blended Pistachio Matcha"],
        ["Hot Matcha"],
        ["Iced Mango Vanilla Matcha"],
      ]),
      c("juices", "Juices and smoothies", [
        ["Fresh Avocado Cocktail"],
        ["Pina Colada"],
        ["Banana Berries"],
        ["Mango Colada"],
        ["Strawberry Colada"],
        ["Fresh Kiwi Cocktail"],
        ["Mango Smoothie"],
        ["Lemon Mint"],
        ["Strawberries Smoothie"],
        ["Orange Strawberries"],
        ["Watermelon Smoothie"],
        ["Fresh Mango Juice"],
        ["Fresh Lemon Juice"],
        ["Fresh Orange Juice"],
        ["Fresh Strawberry Juice"],
        ["Fresh Guava Juice"],
        ["Fresh Fig"],
        ["Banana and Milk"],
      ]),
      c("yogurt", "Yogurt mixes", [
        ["Mix Berry"],
        ["Strawberries"],
        ["Peach"],
        ["Honey"],
      ]),
      c("soft", "Soft drinks and water", [
        ["Red Bull"],
        ["Fayrouz Pineapple"],
        ["Birel", "Non alcoholic"],
        ["Sparkling Water"],
        ["Pepsi"],
        ["Diet Pepsi"],
        ["7 Up"],
        ["Mirinda Orange"],
        ["Water (large)"],
        ["Water (small)"],
      ]),
    ],
  },
  {
    key: "breakfast",
    label: "Breakfast",
    note: "Oriental trays, eggs and benedicts, served through the morning.",
    categories: [
      c("breakfast", "Breakfast", [
        ["Full Oriental Breakfast Tray", "Feteer meshaltet / foul / eggs / tameyya / gebna beida / labna / salad / molasses / gebna adeema"],
        ["Oriental Breakfast Tray", "Foul / eggs / tameyya / gebna beida / labna / salad"],
        ["Salmon Avocado Omelet", "Smoked salmon, avocado, capers, labna, onion and sumac, with herb potato cubes and salad"],
        ["Smoked Salmon Eggs Benedict", "Two poached eggs, smoked salmon, arugula, avocado, spinach and hollandaise"],
        ["Avocado and Beef Bacon Benedict", "Two poached eggs, beef bacon, arugula, guacamole and hollandaise"],
        ["Mushroom Cheese Spinach Omelet", "Cheddar, fresh mushroom, spinach and cherry tomatoes, with herb potato cubes and salad"],
        ["Pastrami Eggs Casserole", "Sunny side up eggs with pastrami, tomatoes and arugula"],
        ["Smoked Turkey Benedict", "Two poached eggs, smoked turkey, mayonnaise, arugula, sun dried tomatoes and hollandaise"],
        ["Hash Brown Eggs and Cheese Casserole", "Eggs with feta, fries, broccoli and tomatoes"],
        ["Egg White Cheese and Olives Omelet", "Feta, black olives, mushroom and bell pepper, with herb potato cubes and salad"],
        ["Eggs Shakshooka Casserole", "Sunny side up eggs with oriental shakshooka mix"],
        ["Focaccia Spanish Egg"],
        ["Flat Bread, Smoked Salmon and Cheese", "Flat bread with cream cheese, smoked salmon and capers"],
        ["Chicken Ranch Croissant"],
        ["Flat Bread, Minced Beef and Eggs", "Flat bread with herbed minced beef, eggs and parsley"],
        ["Turkey Omelette Croissant"],
        ["Flat Bread, Beef Bacon and Eggs", "Flat bread with beef bacon, cherry tomatoes and eggs"],
        ["Omelette Hot Dogs Croissant"],
        ["Mixed Cheese Croissant"],
      ]),
    ],
  },
  {
    key: "dessert",
    label: "Dessert",
    note: "Pancakes, waffles and the pastry counter.",
    categories: [
      c("dessert", "Dessert", [
        ["Four Seasons Waffle"],
        ["Cream Brûlée French Toast"],
        ["Oreo Ice Cream Waffle"],
        ["Waffle Croissant", "Make your own: pistachio, Nutella or strawberry"],
        ["Pistachio Pancake"],
        ["Nutella Ice Cream Pancake"],
        ["Chocolate Lava Cake with Ice Cream"],
        ["Nutella Pancake"],
        ["Lotus Pancake"],
        ["Blueberry Cheesecake"],
        ["Strawberry Cheesecake"],
        ["Chocolate Fudge"],
        ["Tiramisu"],
        ["Eclair Nutella"],
        ["Eclair Caramel"],
        ["Om Ali"],
        ["Ice Cream", "French vanilla, chocolate, strawberry or mango"],
      ]),
    ],
  },
  {
    key: "kids",
    label: "Kids",
    note: "Smaller plates for the table's youngest.",
    categories: [
      c("kids", "Kids", [
        ["Pasta Meatballs"],
        ["Pasta Crispy Chicken"],
        ["Chicken Strips"],
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
