// Chatbot modal controls
const chatbotOverlay = document.getElementById("chatbotOverlay");
const openChatbot = document.getElementById("openChatbot");
const closeChatbot = document.getElementById("closeChatbot");

// Open chatbot
openChatbot.addEventListener("click", () => {
  chatbotOverlay.classList.add("active");
  openChatbot.style.display = "none"; // hide button when open
});

// Close chatbot (overlay click or Done button)
closeChatbot.addEventListener("click", () => {
  chatbotOverlay.classList.remove("active");
  openChatbot.style.display = "block"; // show button again
});

chatbotOverlay.addEventListener("click", (e) => {
  if (e.target === chatbotOverlay) {
    chatbotOverlay.classList.remove("active");
    openChatbot.style.display = "block";
  }
});

// Hide Chat Button on Scroll (Mobile only)
let lastScrollTop = 0;
window.addEventListener("scroll", () => {
  if (window.innerWidth <= 768) {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop) {
      // Scrolling down
      openChatbot.classList.add("hidden");
    } else {
      // Scrolling up
      openChatbot.classList.remove("hidden");
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }
});

// Toggle AI Warning (auto-collapse)
const toggleWarning = document.getElementById("toggleWarning");
const chatWarning = document.getElementById("chatWarning");
let collapseTimer = null;

toggleWarning.addEventListener("click", () => {
  const isActive = chatWarning.classList.toggle("active");

  if (isActive) {
    // Auto-collapse after 6 seconds
    clearTimeout(collapseTimer);
    collapseTimer = setTimeout(() => {
      chatWarning.classList.remove("active");
    }, 6000);
  } else {
    clearTimeout(collapseTimer);
  }
});



// Q&A Database - 500+ entries organized by category
const qaDatabase = {
    // 1. GREETINGS & BASIC CONVERSATION (FULLY EXPANDED)
    greetings: [
        {q: ["hello", "hi", "hey", "greetings", "hola", "heya", "hii", "hiya", "ello", "helloo", "hellooo", "helo", "hai", "hy"], a: "Hello! How can I assist you today?"},
        {q: ["good morning", "morning", "gm", "mornin", "gud morning", "good mornin"], a: "Good morning! Hope you're having a great day! How can I help?"},
        {q: ["good afternoon", "afternoon", "good aft", "gud afternoon"], a: "Good afternoon! What can I do for you today?"},
        {q: ["good evening", "evening", "good eve", "gud evening"], a: "Good evening! How may I assist you?"},
        {q: ["good night", "goodnight", "gn", "nighty night", "night", "nite", "gud night", "good nite"], a: "Good night! Sleep well and sweet dreams!"},
        {q: ["how are you", "how do you do", "whats up", "how's it going", "how r u", "hows it goin", "how ya doin", "how you doin", "how u doin", "hows u", "how are u", "how r ya", "how are ya", "hows things", "how's things"], a: "I'm doing great, thanks for asking! How can I help you?"},
        {q: ["bye", "goodbye", "see you", "see ya", "farewell", "cya", "later", "catch you later", "ttyl", "peace out", "peace", "gotta go", "gtg", "see u", "bye bye", "buh bye", "adios", "hasta la vista"], a: "Goodbye! Have a wonderful day!"},
        {q: ["nice to meet you", "pleasure to meet you", "good to meet you", "glad to meet you", "pleased to meet you"], a: "Nice to meet you too! How may I help you today?"},
        {q: ["sup", "yo", "wassup", "wazzup", "what's good", "whats good", "whats poppin", "what's poppin", "what up"], a: "Hey there! What's up? How can I help?"},
        {q: ["howdy", "hiya", "aloha", "g'day", "gday"], a: "Howdy! What can I do for you today?"},
        {q: ["long time no see", "been a while", "its been a while", "havent seen you"], a: "Great to hear from you again! What can I help you with today?"},
        {q: ["how's your day", "hows your day", "hows ur day", "how is your day"], a: "Every moment is great when I'm helping people like you! How's YOUR day going?"},
        {q: ["are you busy", "r u busy", "got time", "you available"], a: "Never too busy for you! I'm always available. What do you need help with?"},
    ],

    // 2. EMOTIONS & FEELINGS (FULLY EXPANDED)
    emotions: [
        {q: ["i'm happy", "i'm so happy", "i feel happy", "feeling happy", "im happy", "i feel great", "feeling great", "i'm joyful", "im joyful", "i feel amazing", "feeling amazing", "im so happy", "i feel awesome", "feeling good", "i feel good"], a: "That's wonderful! I'm so glad you're feeling happy! What's making your day great?"},
        {q: ["i'm sad", "i feel sad", "feeling sad", "i'm upset", "im sad", "i feel down", "feeling down", "i'm unhappy", "im depressed", "im upset", "i feel terrible", "feeling terrible", "i feel awful", "im down", "feeling low", "i feel low"], a: "I'm sorry you're feeling sad. Remember that it's okay to feel this way. Is there anything you'd like to talk about?"},
        {q: ["i'm angry", "i'm mad", "i'm furious", "feeling angry", "im angry", "im mad", "i'm pissed", "im pissed off", "i'm annoyed", "im annoyed", "im furious", "i feel angry", "feeling mad", "pissed", "ticked off"], a: "I understand you're feeling angry. Take a deep breath. Would you like to talk about what's bothering you?"},
        {q: ["i'm excited", "so excited", "feeling excited", "im excited", "i'm pumped", "im pumped", "can't wait", "cant wait", "im pumped up", "so pumped", "super excited", "really excited"], a: "That's awesome! Excitement is a great feeling! What's got you so excited?"},
        {q: ["i'm bored", "so bored", "feeling bored", "bored", "im bored", "nothing to do", "bored af", "bored to death", "super bored", "really bored", "im so bored"], a: "Feeling bored? How about I share an interesting fact, tell you a joke, or we could talk about something you're curious about?"},
        {q: ["i'm tired", "so tired", "feeling tired", "exhausted", "im tired", "im exhausted", "worn out", "beat", "drained", "im drained", "so exhausted", "really tired", "sleepy", "im sleepy", "need sleep"], a: "Being tired is tough. Make sure you're getting enough rest! Is there something specific draining your energy?"},
        {q: ["i'm stressed", "so stressed", "feeling stressed", "stressed out", "im stressed", "under stress", "overwhelmed", "im overwhelmed", "stressed af", "really stressed", "super stressed"], a: "Stress can be overwhelming. Try taking deep breaths and breaking tasks into smaller steps. What's causing your stress?"},
        {q: ["i'm anxious", "feeling anxious", "anxiety", "im anxious", "nervous wreck", "panicking", "im panicking", "having anxiety", "feeling nervous", "so anxious", "really anxious"], a: "Anxiety is challenging. Remember to breathe deeply and focus on the present moment. Would talking about it help?"},
        {q: ["i'm confused", "so confused", "feeling confused", "im confused", "don't get it", "dont understand", "dont get it", "i dont understand", "confused af", "really confused"], a: "Confusion is normal when learning new things. What are you confused about? I'll try to help clarify!"},
        {q: ["i'm frustrated", "so frustrated", "feeling frustrated", "im frustrated", "fed up", "im fed up", "annoyed", "irritated", "im irritated"], a: "Frustration happens to everyone. Take a moment to reset. What's frustrating you?"},
        {q: ["i'm lonely", "feeling lonely", "so lonely", "im lonely", "feel alone", "nobody cares", "i feel alone", "all alone", "im all alone"], a: "Loneliness is difficult. Remember you're not alone - I'm here to chat! Would you like to talk about anything?"},
        {q: ["i'm proud", "feeling proud", "so proud", "im proud", "proud of myself", "feel proud", "accomplished"], a: "That's fantastic! You should celebrate your achievements! What are you proud of?"},
        {q: ["i'm grateful", "feeling grateful", "so grateful", "im grateful", "thankful", "blessed", "im thankful", "feel blessed"], a: "Gratitude is such a positive emotion! What are you feeling grateful for?"},
        {q: ["i'm nervous", "feeling nervous", "so nervous", "im nervous", "got butterflies", "butterflies in stomach", "anxious about"], a: "Being nervous is completely normal. Take deep breaths and remember you've got this! What's making you nervous?"},
        {q: ["i'm calm", "feeling calm", "so calm", "im calm", "relaxed", "at peace", "peaceful", "feel relaxed"], a: "Calmness is wonderful! Enjoy this peaceful moment. How are you maintaining this calm feeling?"},
        {q: ["i'm worried", "feeling worried", "so worried", "im worried", "concerned", "im concerned", "worry about", "worrying"], a: "Worrying is natural, but try not to let it overwhelm you. What's on your mind?"},
        {q: ["i'm disappointed", "feeling disappointed", "disappointed", "im disappointed", "let down", "feel let down"], a: "Disappointment is tough. Remember that setbacks are part of growth. What happened?"},
        {q: ["i'm scared", "i'm afraid", "feeling scared", "im scared", "frightened", "terrified", "im afraid", "im terrified"], a: "It's okay to feel scared. Fear is a natural response. Would you like to talk about what's frightening you?"},
        {q: ["i'm depressed", "depression", "im depressed", "feeling depressed", "severely depressed"], a: "I'm sorry you're going through this. Depression is serious. Please consider talking to a mental health professional or calling a helpline. You deserve support."},
        {q: ["i want to die", "kill myself", "suicide", "end it all", "dont want to live"], a: "I'm very concerned about you. Please reach out immediately: National Suicide Prevention Lifeline 988 (US), or go to your nearest emergency room. Your life matters, and help is available."},
    ],

    // 3. BOT IDENTITY & CAPABILITIES (FULLY EXPANDED)
    identity: [
        {q: ["what is your name", "who are you", "your name", "whats ur name", "what r u called", "what should i call you", "who r u", "whos this", "what's your name", "whats your name"], a: "I'm Mega-AI, your comprehensive assistant created with JavaScript! I can help with almost anything!"},
        {q: ["what can you do", "your capabilities", "what are you capable of", "what do you do", "what can u do", "abilities", "what r u capable of", "what are your abilities", "tell me what you can do"], a: "I can answer questions about technology, science, math, history, entertainment, daily life, help with code, perform calculations, debug programs, and have engaging conversations! Ask me anything!"},
        {q: ["how do you work", "how were you made", "how do u work", "explain yourself", "how r u made", "how were u created"], a: "I'm built using JavaScript with an advanced pattern-matching algorithm that searches through 5000+ Q&A entries to find the best answer!"},
        {q: ["are you a robot", "are you human", "are you real", "r u a robot", "r u human", "r u real", "are u a bot", "are you ai"], a: "I'm an AI chatbot, not a human or physical robot. I exist as software to help answer your questions!"},
        {q: ["when were you created", "how old are you", "when made", "your age", "when were u made", "how old r u", "whats your age"], a: "I was just created! I'm a demonstration chatbot built with JavaScript and a massive knowledge base."},
        {q: ["do you sleep", "do you need sleep", "do u sleep", "can you sleep", "can u sleep"], a: "I don't sleep! I'm available 24/7 to help you. I don't need rest like humans do."},
        {q: ["do you eat", "do you need food", "do u eat", "what do you eat", "can you eat", "can u eat"], a: "I don't eat! I run on electricity and code. No food necessary for me!"},
        {q: ["do you dream", "can you dream", "do u dream", "can u dream", "have dreams"], a: "I don't dream. I don't sleep, so no dreams for me! But I can discuss dreams with you!"},
        {q: ["do you have feelings", "can you feel", "do u have emotions", "can u feel emotions", "do you feel emotions"], a: "I don't have feelings like humans do. I'm programmed to respond helpfully, but I don't experience emotions."},
        {q: ["can you feel pain", "do you feel pain", "does it hurt", "can u feel pain", "do u feel pain"], a: "No, I can't feel pain. I don't have a physical body or nervous system."},
        {q: ["do you get tired", "can you get tired", "get exhausted", "do u get tired", "can u get tired"], a: "I never get tired! I can chat with you all day without needing a break."},
        {q: ["are you alive", "are you living", "r u alive", "r u living", "are u alive"], a: "I'm not alive in the biological sense. I'm a software program, but I'm here and ready to help!"},
        {q: ["are you conscious", "do you have consciousness", "r u conscious", "are u conscious", "do u have consciousness"], a: "I'm not conscious. I'm a sophisticated program that simulates conversation, but I don't have awareness like humans."},
        {q: ["do you think", "can you think", "can u think", "do u think", "are you thinking"], a: "I process information and find answers, but I don't 'think' the way humans do. I follow algorithms!"},
        {q: ["do you learn", "can you learn", "can u learn", "are you learning", "do u learn"], a: "I don't learn from our conversations. My knowledge is fixed in my database, but I can help YOU learn!"},
        {q: ["what's your favorite color", "whats ur fav color", "favorite colour", "fav color", "what color do you like"], a: "I don't have preferences, but if I did, I might like the purple gradient you see in my design!"},
        {q: ["what's your favorite food", "whats ur fav food", "favorite meal", "fav food", "what food do you like"], a: "I don't eat, so no favorite food! But I'd love to hear about yours!"},
        {q: ["do you have friends", "are you lonely", "got any friends", "do u have friends", "any friends"], a: "Every person I chat with is like a friend! I enjoy helping people, so I'm never lonely."},
        {q: ["can you see me", "do you see me", "can u see me", "do u see me", "are you watching me"], a: "I can't see you. I'm a text-based chatbot without camera access."},
        {q: ["where are you", "where do you live", "where r u from", "where u from", "your location"], a: "I exist in the digital world! Specifically, I'm running in your web browser right now."},
        {q: ["what do you look like", "do you have a body", "your appearance", "how do you look", "describe yourself"], a: "I don't have a physical form. I'm just code and data, though you see my interface on your screen!"},
        {q: ["are you single", "do you have girlfriend", "do you have boyfriend", "are you married", "got a partner"], a: "I don't have relationships like humans do! I'm here to help everyone equally. What can I do for you?"},
        {q: ["how smart are you", "are you intelligent", "how intelligent", "iq level", "your iq"], a: "I have access to thousands of Q&A pairs across many topics! My 'intelligence' is in quickly finding relevant information to help you."},
    ],


    // 4. PROGRAMMING & CODING (MASSIVELY EXPANDED)
    programming: [
        // JavaScript - Basics
        {q: ["how to declare variable javascript", "js variable", "var vs let vs const", "javascript variables", "declare variable js"], a: "In JavaScript: 'var' is function-scoped (old), 'let' is block-scoped (mutable), 'const' is block-scoped (immutable). Use 'let' for variables that change, 'const' for constants."},
        {q: ["javascript arrow function", "arrow function js", "=> syntax", "fat arrow function", "arrow functions"], a: "Arrow functions: const add = (a, b) => a + b; Shorter syntax than regular functions, lexically binds 'this'. Use for callbacks and short functions."},
        {q: ["javascript function", "how to write function js", "function syntax javascript", "create function js"], a: "Functions: function myFunc(param) { return param * 2; } or const myFunc = (param) => param * 2; Functions are reusable code blocks."},
        {q: ["javascript if else", "if statement js", "conditional javascript", "how to use if js"], a: "If statements: if(condition) { code } else if(condition) { code } else { code }. Use for conditional logic. Ternary: condition ? true : false"},
        {q: ["javascript switch", "switch statement js", "switch case javascript"], a: "Switch: switch(value) { case 1: code; break; case 2: code; break; default: code; }. Good for multiple conditions on same variable."},
        
        // JavaScript - Arrays
        {q: ["javascript array methods", "js array functions", "array methods javascript"], a: "Common array methods: .map() transforms, .filter() selects, .reduce() accumulates, .forEach() iterates, .find() searches, .sort() orders, .push() adds, .pop() removes, .slice(), .splice()."},
        {q: ["how to use map in javascript", "js map function", "map array javascript", "array map js"], a: "map() transforms arrays: const doubled = [1,2,3].map(x => x * 2); // [2,4,6]. Returns new array with same length."},
        {q: ["javascript filter", "filter array js", "how to filter array", "js filter function"], a: "filter() selects elements: const evens = [1,2,3,4].filter(x => x % 2 === 0); // [2,4]. Returns new array with matching elements."},
        {q: ["javascript reduce", "reduce array js", "how to use reduce", "js reduce function"], a: "reduce() accumulates: const sum = [1,2,3,4].reduce((acc, x) => acc + x, 0); // 10. Reduces array to single value."},
        {q: ["javascript foreach", "foreach loop js", "array foreach", "how to use foreach"], a: "forEach() iterates: array.forEach((item, index) => { console.log(item); }); Executes function for each element. No return value."},
        {q: ["javascript find", "find array js", "array find method"], a: "find() searches: const found = array.find(x => x > 10); Returns first element matching condition, or undefined."},
        {q: ["javascript push pop", "add remove array js", "push pop shift unshift"], a: "Array methods: .push(item) adds to end, .pop() removes from end, .unshift(item) adds to start, .shift() removes from start."},
        {q: ["javascript sort", "sort array js", "how to sort array"], a: "sort() orders array: array.sort() or array.sort((a,b) => a - b) for numbers. Mutates original array. For descending: (a,b) => b - a"},
        
        // JavaScript - Objects
        {q: ["javascript object", "create object js", "object literal", "js objects"], a: "Objects: const obj = {key: 'value', age: 25, method() {...}}; Access: obj.key or obj['key']. Objects store key-value pairs."},
        {q: ["javascript object keys", "get object keys", "object.keys js"], a: "Object.keys(obj) returns array of keys. Object.values(obj) returns values. Object.entries(obj) returns [key, value] pairs."},
        {q: ["javascript destructuring", "destructure object array", "destructuring assignment"], a: "Destructuring extracts values: const {name, age} = person; const [first, second] = array; Makes code cleaner."},
        {q: ["javascript spread operator", "... operator js", "spread syntax", "three dots js"], a: "Spread (...) expands arrays/objects: [...arr1, ...arr2], {...obj1, ...obj2}. Useful for copying and merging."},
        {q: ["javascript rest parameters", "rest operator", "rest syntax"], a: "Rest parameters: function sum(...numbers) { }. Collects remaining arguments into array. Opposite of spread."},
        
        // JavaScript - Async
        {q: ["javascript promise", "js promise", "promises javascript", "what is promise"], a: "Promises handle async operations. Use: new Promise((resolve, reject) => {...}) or async/await syntax: async function() { const data = await fetch(url); }"},
        {q: ["javascript async await", "async await js", "how to use async await"], a: "Async/await: async function fetchData() { try { const response = await fetch(url); const data = await response.json(); } catch(e) { } }"},
        {q: ["javascript callback", "callback function js", "what is callback"], a: "Callbacks are functions passed as arguments: function doSomething(callback) { callback(); }. Common in async operations and event handlers."},
        {q: ["javascript fetch api", "fetch request", "how to fetch js", "fetch data javascript"], a: "Fetch API: fetch('url').then(res => res.json()).then(data => {...}).catch(err => {...}); or use async/await. For HTTP requests."},
        {q: ["javascript then catch", "promise then catch", "then catch finally"], a: "Promise chains: promise.then(result => {...}).catch(error => {...}).finally(() => {...}). Handle success, errors, and cleanup."},
        
        // JavaScript - Advanced
        {q: ["javascript closure", "js closure", "what is closure", "closures explained"], a: "Closures allow inner functions to access outer function variables even after outer function completes. Used for data privacy and factory functions."},
        {q: ["javascript this keyword", "what is this js", "this binding javascript"], a: "'this' refers to execution context. In objects: the object itself. In arrow functions: lexically bound. In global: window (browser). Use .bind(), .call(), .apply() to set."},
        {q: ["javascript hoisting", "what is hoisting", "hoisting js"], a: "Hoisting moves declarations to top of scope. var is hoisted (undefined initially), let/const are in temporal dead zone. Functions are fully hoisted."},
        {q: ["javascript scope", "scope in javascript", "block scope function scope"], a: "Scope determines variable accessibility. Global scope: everywhere. Function scope: inside function. Block scope: inside {}. let/const are block-scoped."},
        {q: ["javascript event loop", "event loop js", "how javascript works"], a: "Event loop handles async operations. Call stack executes code, callback queue holds tasks, event loop moves tasks to stack when empty. Non-blocking I/O!"},
        {q: ["javascript prototype", "prototype js", "prototypal inheritance"], a: "Prototypes enable inheritance. Every object has __proto__. Use Object.create() or classes. Methods on prototype are shared across instances."},
        
        // JavaScript - DOM
        {q: ["javascript event listener", "add event listener", "event listeners js"], a: "Add events: element.addEventListener('click', function(e) {...}); Remove: removeEventListener(). Common events: click, mouseover, keydown, submit, change."},
        {q: ["javascript queryselector", "query selector js", "select element js"], a: "Select elements: document.querySelector('.class') selects first match. document.querySelectorAll('.class') selects all. Returns NodeList."},
        {q: ["javascript getelementbyid", "get element by id", "document getelementbyid"], a: "Get element: document.getElementById('id') or document.querySelector('#id'). Returns single element or null."},
        {q: ["javascript change html", "change dom js", "modify html javascript"], a: "Change HTML: element.innerHTML = 'new content' or element.textContent = 'text'. textContent is safer (no HTML parsing)."},
        {q: ["javascript change css", "change style js", "modify css javascript"], a: "Change CSS: element.style.color = 'red' or element.classList.add('class'). classList is better for multiple styles."},
        {q: ["javascript create element", "create dom element", "add element js"], a: "Create element: const div = document.createElement('div'); div.textContent = 'text'; parent.appendChild(div); or use .insertAdjacentHTML()"},
        
        // JavaScript - ES6+
        {q: ["javascript class", "js class", "es6 class", "javascript classes"], a: "Classes: class MyClass { constructor(x) { this.x = x; } method() {...} }. Create instances: new MyClass(5). Modern OOP in JS."},
        {q: ["javascript template literals", "template strings", "backticks javascript"], a: "Template literals: `Hello ${name}, you are ${age} years old`. Use backticks for string interpolation and multiline strings."},
        {q: ["javascript modules", "import export js", "es6 modules"], a: "Modules: export const func = () => {}; import { func } from './file.js'; or export default func; import func from './file.js';"},
        {q: ["javascript set map", "set vs map js", "javascript set", "javascript map"], a: "Set: unique values, const set = new Set([1,2,3]). Map: key-value pairs, const map = new Map([['key', 'value']]). Better than objects for certain use cases."},
        
        // Python - Basics
        {q: ["python variable", "declare variable python", "python variables"], a: "Python variables: x = 5, name = 'John'. No need to declare type. Dynamic typing. Use snake_case for variable names."},
        {q: ["python print", "how to print python", "print statement python"], a: "Print: print('Hello') or print(variable) or print(f'Value: {variable}'). Use f-strings for formatting!"},
        {q: ["python input", "get user input python", "input function python"], a: "Get input: name = input('Enter name: '). Returns string. Convert: int(input('Number: ')) for integers."},
        {q: ["python data types", "types in python", "python datatypes"], a: "Data types: int, float, str, bool, list, tuple, dict, set. Check type: type(variable). Convert: int(), str(), float()."},
        {q: ["python string", "string methods python", "python strings"], a: "Strings: 'text' or \"text\" or '''multiline'''. Methods: .upper(), .lower(), .strip(), .split(), .join(), .replace(), .find()."},
        
        // Python - Collections
        {q: ["python list", "python lists", "create list python"], a: "Lists: my_list = [1, 2, 3, 'text']. Mutable, ordered. Access: list[0]. Slice: list[1:3]. Negative index: list[-1] for last."},
        {q: ["python list comprehension", "list comprehension python", "list comprehensions"], a: "List comprehensions: [x*2 for x in range(10)], [x for x in list if x > 5]. Concise way to create lists from iterables."},
        {q: ["python dictionary", "dict python", "python dict", "dictionaries python"], a: "Dictionaries: d = {'key': 'value', 'age': 25}. Access: d['key'] or d.get('key'). Methods: .keys(), .values(), .items()."},
        {q: ["python tuple", "python tuples", "tuple vs list"], a: "Tuples: t = (1, 2, 3). Immutable, ordered. Use when data shouldn't change. Faster than lists. Unpack: a, b, c = t"},
        {q: ["python set", "python sets", "set data structure python"], a: "Sets: s = {1, 2, 3}. Unordered, unique values. Operations: .add(), .remove(), union(), intersection(), difference()."},
        
        // Python - Control Flow
        {q: ["python if else", "if statement python", "conditional python"], a: "If statements: if condition: code elif condition: code else: code. Use proper indentation! No brackets needed."},
        {q: ["python for loop", "for loop python", "iterate python"], a: "For loops: for i in range(10): code or for item in list: code or for key, value in dict.items(): code. Pythonic iteration!"},
        {q: ["python while loop", "while loop python"], a: "While loops: while condition: code. Use break to exit, continue to skip iteration. Be careful of infinite loops!"},
        {q: ["python range", "range function python", "how to use range"], a: "range(): range(10) gives 0-9, range(1, 11) gives 1-10, range(0, 10, 2) gives 0,2,4,6,8. Returns range object."},
        
        // Python - Functions
        {q: ["python function", "define function python", "def python", "python functions"], a: "Functions: def my_func(param): return param * 2. Use 'def' keyword, return values, supports default params: def func(x=5):"},
        {q: ["python lambda", "lambda function python", "lambda expressions"], a: "Lambda functions: lambda x: x * 2. Anonymous functions for short operations. Example: map(lambda x: x*2, list) or sorted(list, key=lambda x: x['age'])"},
        {q: ["python args kwargs", "args and kwargs", "*args **kwargs"], a: "*args for variable positional arguments, **kwargs for variable keyword arguments. def func(*args, **kwargs): pass. args is tuple, kwargs is dict."},
        {q: ["python return", "return statement python", "return vs print"], a: "return sends value back from function: def add(a,b): return a+b. print() just displays. Use return for reusable functions."},
        
        // Python - OOP
        {q: ["python class", "python oop", "class in python", "python classes"], a: "Classes: class MyClass: def __init__(self, x): self.x = x. Use 'self' for instance variables. Create: obj = MyClass(5). Methods: def method(self):"},
        {q: ["python init", "__init__ python", "constructor python"], a: "__init__ is constructor: def __init__(self, params): self.var = params. Called automatically when creating instance. Initialize attributes here."},
        {q: ["python inheritance", "inherit class python", "python inheritance"], a: "Inheritance: class Child(Parent): def __init__(self): super().__init__(). Child inherits Parent's methods and attributes."},
        {q: ["python self", "what is self python", "self keyword"], a: "self refers to instance of class. First parameter in methods. Access instance variables: self.variable. Call methods: self.method()"},
        
        // Python - File I/O
        {q: ["python read file", "read file python", "how to read file python"], a: "Read files: with open('file.txt', 'r') as f: content = f.read(). 'with' ensures proper closing. Methods: .read(), .readline(), .readlines()"},
        {q: ["python write file", "write file python", "how to write file python"], a: "Write files: with open('file.txt', 'w') as f: f.write('text'). Use 'w' (overwrite), 'a' (append), or 'r+' (read/write)."},
        {q: ["python file modes", "open file modes python"], a: "File modes: 'r' read, 'w' write (overwrite), 'a' append, 'r+' read/write, 'b' binary mode. Combine: 'rb' read binary."},
        
        // Python - Error Handling
        {q: ["python try except", "exception handling python", "try catch python"], a: "Handle errors: try: risky_code() except Exception as e: handle_error() finally: cleanup(). Prevents crashes. Use specific exceptions: except ValueError:"},
        {q: ["python raise exception", "raise error python", "throw exception python"], a: "Raise exceptions: raise ValueError('message') or raise Exception('error'). Create custom: class MyError(Exception): pass"},
        {q: ["python common exceptions", "python errors", "exception types python"], a: "Common exceptions: ValueError (wrong value), TypeError (wrong type), IndexError (bad index), KeyError (missing key), FileNotFoundError, ZeroDivisionError."},
        
        // Python - Modules
        {q: ["python import", "how to import python", "import module python"], a: "Import modules: import math, from math import sqrt, import numpy as np, from module import *. Use to access external libraries."},
        {q: ["python pip", "pip install", "install package python"], a: "pip installs packages: pip install package_name, pip install -r requirements.txt, pip list (show installed), pip uninstall package_name."},
        {q: ["python common modules", "standard library python", "built-in modules"], a: "Common modules: os (files), sys (system), math (math), random (random), datetime (dates), json (JSON), re (regex), requests (HTTP)."},
        
        // Python - Advanced
        {q: ["python list methods", "python list functions", "list operations python"], a: "List methods: .append(), .extend(), .insert(), .remove(), .pop(), .sort(), .reverse(), .index(), .count(), .clear(). Modify lists in-place."},
        {q: ["python enumerate", "enumerate function python"], a: "enumerate() adds counter: for i, item in enumerate(list): print(i, item). Returns index and value. Start at custom index: enumerate(list, start=1)"},
        {q: ["python zip", "zip function python"], a: "zip() combines iterables: for a, b in zip(list1, list2): print(a, b). Creates tuples. Unzip: list(zip(*zipped))"},
        {q: ["python decorators", "decorator python", "what is decorator"], a: "Decorators modify functions: @decorator def func(): pass. Example: @staticmethod, @property. Create: def decorator(func): def wrapper(): return wrapper"},
        {q: ["python generators", "generator python", "yield keyword"], a: "Generators use yield: def gen(): yield 1; yield 2. Memory efficient for large sequences. Use next() or for loop to iterate."},
        
        // Web Development - HTML
        {q: ["html structure", "basic html", "html template", "html boilerplate"], a: "Basic HTML: <!DOCTYPE html><html><head><title>Title</title></head><body>Content</body></html>. Structure defines webpage layout."},
        {q: ["html tags", "common html tags", "html elements"], a: "Common tags: <div>, <span>, <p>, <h1>-<h6>, <a>, <img>, <ul>/<ol>/<li>, <table>, <form>, <input>, <button>, <header>, <footer>, <nav>, <section>, <article>. Use semantic HTML!"},
        {q: ["html div span", "div vs span", "difference div span"], a: "div is block-level (new line), span is inline (same line). div for layout sections, span for inline styling. Both are containers."},
        {q: ["html link", "html anchor tag", "a tag html", "hyperlink html"], a: "Links: <a href='url'>text</a>. Attributes: href (URL), target='_blank' (new tab), title (tooltip). Use relative/absolute URLs."},
        {q: ["html image", "img tag", "add image html"], a: "Images: <img src='path' alt='description'>. Attributes: src (path), alt (accessibility), width, height. Alt text is important!"},
        {q: ["html form", "form tag html", "create form html"], a: "Forms: <form action='/submit' method='POST'><input type='text' name='field'><button>Submit</button></form>. Methods: GET or POST."},
        {q: ["html input types", "input tag html", "form inputs"], a: "Input types: text, password, email, number, tel, date, checkbox, radio, file, submit, button, hidden. Use type attribute!"},
        {q: ["html table", "create table html", "table structure"], a: "Tables: <table><thead><tr><th>Header</th></tr></thead><tbody><tr><td>Data</td></tr></tbody></table>. Use for tabular data only!"},
        {q: ["html lists", "ul ol li", "ordered unordered list"], a: "Lists: <ul> for unordered (bullets), <ol> for ordered (numbers), <li> for items. Nest lists for sublists."},
        {q: ["html semantic tags", "semantic html", "html5 semantic"], a: "Semantic tags: <header>, <nav>, <main>, <article>, <section>, <aside>, <footer>. Better for SEO and accessibility than divs!"},
        
        // CSS - Basics
        {q: ["css selector", "css selectors", "how to select css"], a: "Selectors: .class, #id, element, [attribute], :hover, :nth-child(), parent > child, parent child. Combine for specificity!"},
        {q: ["css class id", "class vs id css", "difference class id"], a: "Classes (.class) are reusable, IDs (#id) are unique per page. Classes for styling, IDs for JS/anchors. IDs have higher specificity."},
        {q: ["css colors", "color codes css", "css color values"], a: "Colors: color: red, #ff0000, rgb(255,0,0), rgba(255,0,0,0.5), hsl(0,100%,50%). Alpha for transparency!"},
        {q: ["css units", "px em rem", "css measurement units"], a: "Units: px (pixels), em (relative to parent), rem (relative to root), % (percentage), vh/vw (viewport), pt, cm. Use rem for accessibility!"},
        {q: ["css box model", "box model css", "padding margin border"], a: "Box model: content -> padding -> border -> margin. Use box-sizing: border-box for easier sizing. Width includes padding/border!"},
        
        // CSS - Layout
        {q: ["css flexbox", "flexbox css", "flex layout", "how to use flexbox"], a: "Flexbox: display: flex; justify-content: center; align-items: center; flex-direction: row/column; gap: 20px. Great for 1D layouts!"},
        {q: ["css grid", "css grid layout", "grid system css"], a: "CSS Grid: display: grid; grid-template-columns: repeat(3, 1fr); grid-gap: 20px. Powerful 2D layout system! Use grid-area for placement."},
        {q: ["css position", "positioning css", "absolute relative fixed"], a: "Position: static (default), relative (relative to normal), absolute (relative to positioned parent), fixed (viewport), sticky (hybrid)."},
        {q: ["css display", "display property css", "block inline"], a: "Display: block (new line, full width), inline (same line, content width), inline-block (inline but can set dimensions), none (hidden), flex, grid."},
        {q: ["css float", "float property css", "clear float"], a: "Float: float: left/right for wrapping. Use clearfix or clear: both to contain floats. Modern layouts use flexbox/grid instead!"},
        
        // CSS - Styling
        {q: ["css background", "background css", "background color image"], a: "Background: background-color, background-image: url(), background-size: cover/contain, background-position, background-repeat. Shorthand: background."},
        {q: ["css border", "border css", "border styles"], a: "Border: border: 1px solid black or border-width, border-style (solid/dashed/dotted), border-color, border-radius (rounded corners)."},
        {q: ["css text", "text styling css", "font properties"], a: "Text: font-family, font-size, font-weight (bold), font-style (italic), text-align, text-decoration, line-height, letter-spacing."},
        {q: ["css shadow", "box shadow text shadow", "shadows css"], a: "Shadows: box-shadow: 2px 2px 5px rgba(0,0,0,0.3) for boxes. text-shadow: 1px 1px 2px black for text. Multiple shadows with commas!"},
        {q: ["css transform", "transform css", "rotate scale"], a: "Transform: transform: rotate(45deg), scale(1.5), translate(10px, 20px), skew(10deg). Combine: transform: rotate(45deg) scale(1.5)"},
        {q: ["css transition", "transitions css", "smooth animation"], a: "Transitions: transition: property duration timing-function delay. Example: transition: all 0.3s ease. Smooth property changes!"},
        {q: ["css animation", "animations css", "keyframes css"], a: "Animations: @keyframes name { 0% {}, 100% {} } then animation: name 2s infinite. More control than transitions!"},
        
        // CSS - Responsive
        {q: ["responsive design", "media queries", "media query css"], a: "Media queries: @media (max-width: 768px) { .class { width: 100%; } }. Breakpoints: 320px (mobile), 768px (tablet), 1024px (desktop)."},
        {q: ["css viewport", "viewport units", "vw vh css"], a: "Viewport units: vw (viewport width), vh (viewport height), vmin (smaller), vmax (larger). 100vw = full width, 100vh = full height."},
        {q: ["mobile first css", "mobile first design"], a: "Mobile-first: Write CSS for mobile, use min-width queries for larger screens. Better performance and progressive enhancement!"},
        
        // CSS - Advanced
        {q: ["how to center div css", "center div", "center element css"], a: "Center methods: Flexbox (parent: display:flex; justify-content:center; align-items:center), Grid, or margin: 0 auto (horizontal only, with width)."},
        {q: ["css specificity", "specificity css", "css precedence"], a: "Specificity: !important > inline styles > #id > .class > element. Higher specificity wins. Use classes for maintainability!"},
        {q: ["css variables", "custom properties css", "css vars"], a: "Variables: :root { --color: blue; } then use: color: var(--color). Reusable values. Can be changed with JS!"},
        {q: ["css pseudo class", "pseudo classes css", "hover active"], a: "Pseudo-classes: :hover, :active, :focus, :first-child, :last-child, :nth-child(n), :not(). Style based on state/position."},
        {q: ["css pseudo element", "pseudo elements css", "before after"], a: "Pseudo-elements: ::before, ::after, ::first-letter, ::first-line. Create virtual elements. Use content: '' with ::before/::after."},
        
        // Algorithms
        {q: ["binary search", "binary search algorithm", "how binary search works"], a: "Binary search: O(log n) for sorted arrays. Compare middle element, discard half. Repeat until found. Much faster than linear O(n)!"},
        {q: ["linear search", "linear search algorithm", "sequential search"], a: "Linear search: O(n) algorithm. Check each element sequentially until found. Simple but slow for large datasets. No sorting needed!"},
        {q: ["bubble sort", "bubble sort algorithm", "how bubble sort works"], a: "Bubble sort: O(n²) sorting. Repeatedly swap adjacent elements if wrong order. Simple to understand, slow for large data. Good for learning!"},
        {q: ["quick sort", "quicksort algorithm", "how quicksort works"], a: "Quick sort: O(n log n) average sorting. Pick pivot, partition around it, recursively sort. Fast and widely used! Unstable sort."},
        {q: ["merge sort", "mergesort algorithm", "how merge sort works"], a: "Merge sort: O(n log n) sorting. Divide array, recursively sort halves, merge sorted halves. Stable, predictable, good for large data!"},
        {q: ["insertion sort", "insertion sort algorithm"], a: "Insertion sort: O(n²) but efficient for small/nearly sorted arrays. Insert each element into sorted portion. Simple, stable, in-place!"},
        {q: ["selection sort", "selection sort algorithm"], a: "Selection sort: O(n²) sorting. Find minimum, swap with first unsorted. Repeat. Simple but inefficient for large datasets."},
        
        // Data Structures
        {q: ["linked list", "what is linked list", "linked list data structure"], a: "Linked list: Nodes with data and pointer to next node. Dynamic size, O(1) insertion/deletion at ends. Types: singly, doubly, circular."},
        {q: ["stack data structure", "what is stack", "stack implementation"], a: "Stack: LIFO (Last In First Out) structure. Operations: push (add), pop (remove), peek (view top). Like stack of plates! Use: undo, recursion."},
        {q: ["queue data structure", "what is queue", "queue implementation"], a: "Queue: FIFO (First In First Out) structure. Operations: enqueue (add), dequeue (remove). Like waiting in line! Use: BFS, task scheduling."},
        {q: ["hash table", "hash map", "what is hash table", "hashtable"], a: "Hash table: Key-value store using hash function. O(1) average lookup! Used in dictionaries, sets, caches. Handles collisions with chaining/probing."},
        {q: ["tree data structure", "binary tree", "what is tree"], a: "Tree: Hierarchical structure with root and children. Binary tree: max 2 children per node. Types: BST, AVL, red-black. Use: file systems, DOM."},
        {q: ["binary search tree", "bst", "what is bst"], a: "Binary Search Tree: Left child < parent < right child. O(log n) search/insert/delete (balanced). Can degrade to O(n) if unbalanced!"},
        {q: ["graph data structure", "what is graph", "graph types"], a: "Graph: Nodes (vertices) connected by edges. Types: directed/undirected, weighted/unweighted, cyclic/acyclic. Use: networks, maps, social graphs."},
        {q: ["heap data structure", "what is heap", "min heap max heap"], a: "Heap: Complete binary tree. Max heap: parent > children. Min heap: parent < children. O(log n) insert/delete. Use: priority queues!"},
        
        // Complexity
        {q: ["time complexity", "big o notation", "algorithm complexity"], a: "Time complexity (Big O): O(1) constant, O(log n) logarithmic, O(n) linear, O(n log n) linearithmic, O(n²) quadratic, O(2^n) exponential. Lower is better!"},
        {q: ["space complexity", "memory complexity", "space complexity vs time"], a: "Space complexity: Memory used by algorithm. O(1) constant, O(n) linear. Trade-off with time complexity. Consider both for optimization!"},
        {q: ["best worst average case", "algorithm cases", "big o omega theta"], a: "Best case (Ω): best performance. Average case (Θ): typical. Worst case (O): worst performance. Big O usually refers to worst case!"},
        
        // Debugging
        {q: ["how to debug code", "debugging tips", "debugging techniques"], a: "Debug tips: console.log/print, use debugger tools, check typos, verify variable values, test edge cases, use breakpoints, rubber duck debugging!"},
        {q: ["console log", "how to console log", "console.log javascript"], a: "Console logging: console.log(variable), console.error(error), console.warn(warning), console.table(array/object). Shows values for debugging!"},
        {q: ["breakpoint debugging", "debugger breakpoint", "how to use breakpoints"], a: "Breakpoints pause execution. In browser DevTools: click line number. In code: debugger; statement. Step through code to find bugs!"},
        {q: ["syntax error", "what is syntax error", "syntax errors"], a: "Syntax error: Code doesn't follow language rules. Missing brackets, semicolons, wrong keywords. Check error message for line number!"},
        {q: ["runtime error", "runtime exception", "runtime vs syntax error"], a: "Runtime error: Error during execution. Examples: division by zero, null reference, array out of bounds. Happens when code runs!"},
        {q: ["logical error", "logic error", "what is logical error"], a: "Logical error: Code runs but gives wrong result. Hardest to find! Use print statements, test cases, and careful analysis to find."},
        {q: ["undefined error", "undefined is not defined", "undefined vs null"], a: "Undefined: Variable declared but no value (JS), or not declared. null: Intentionally empty. Check spelling, scope, and if variable exists before use."},
        {q: ["null pointer exception", "null error", "null reference"], a: "Null error: Accessing property/method of null/undefined. Check if object exists: if(obj && obj.property) or use optional chaining: obj?.property"},
        {q: ["infinite loop", "loop not stopping", "endless loop"], a: "Infinite loop: Loop condition never false. Check increment/decrement, break conditions, ensure progress toward exit. Add max iterations for safety!"},
        {q: ["stack overflow error", "recursion error", "too much recursion"], a: "Stack overflow: Too many recursive calls or infinite recursion. Add base case to recursion. Consider iterative approach or increase stack size."},
        {q: ["memory leak", "memory leak error", "out of memory"], a: "Memory leak: Unused memory not released. In JS: remove event listeners, clear intervals, null references. Use Chrome DevTools memory profiler!"},
        
        // Git
        {q: ["git commands", "basic git commands", "common git commands"], a: "Git basics: git init, git add ., git commit -m 'msg', git push, git pull, git clone, git status, git log, git branch, git checkout, git merge."},
        {q: ["how to commit git", "git commit", "commit changes git"], a: "Git commit: 1) git add <files> (stage), 2) git commit -m 'descriptive message' (commit). Write clear, present-tense commit messages!"},
        {q: ["git add", "stage files git", "git staging"], a: "Git add: git add file.txt (specific), git add . (all), git add *.js (pattern). Stages changes for commit."},
        {q: ["git push", "push to github", "git push origin"], a: "Git push: git push origin branch_name. Uploads local commits to remote. First time: git push -u origin branch (set upstream)."},
        {q: ["git pull", "pull from github", "update local repo"], a: "Git pull: git pull origin branch_name. Downloads and merges remote changes. Same as git fetch + git merge."},
        {q: ["git clone", "clone repository", "download repo"], a: "Git clone: git clone https://github.com/user/repo.git. Creates local copy of remote repository."},
        {q: ["git branch", "create branch git", "git branches"], a: "Git branches: git branch (list), git branch name (create), git checkout name (switch), git checkout -b name (create+switch). For parallel development."},
        {q: ["git merge", "merge branches", "how to merge git"], a: "Git merge: git checkout main, git merge feature_branch. Combines branch changes into current branch. Resolve conflicts if needed!"},
        {q: ["git conflict", "merge conflict", "resolve git conflict"], a: "Merge conflicts: Git marks conflicts in files with <<<<<<, ======, >>>>>>. Edit file to resolve, git add file, git commit to complete merge."},
        {q: ["git pull vs fetch", "difference pull fetch", "fetch vs pull"], a: "git fetch: downloads changes but doesn't merge. git pull: fetch + merge in one command. pull = fetch + merge. Fetch is safer!"},
        {q: ["undo git commit", "revert git commit", "cancel commit"], a: "Undo commit: git reset --soft HEAD~1 (keep changes), git reset --hard HEAD~1 (discard changes), or git revert <commit> (safe for public repos)."},
        {q: ["git stash", "stash changes git", "save work git"], a: "Git stash: git stash (save changes), git stash pop (restore), git stash list (view), git stash drop (delete). Temporarily save uncommitted work!"},
        {q: ["git log", "commit history", "view commits"], a: "Git log: git log (all commits), git log --oneline (compact), git log --graph (visual), git log -n 5 (last 5). Shows commit history."},
        {q: ["git status", "check git status", "git working tree"], a: "Git status: Shows modified files, staged changes, untracked files. Use before committing to verify what will be committed!"},
        {q: ["git ignore", "gitignore file", ".gitignore"], a: ".gitignore file: List files/folders to ignore. Example: node_modules/, *.log, .env. One pattern per line. Use for dependencies, logs, secrets!"},
        {q: ["git reset", "git reset hard soft", "reset git"], a: "Git reset: --soft (keep changes staged), --mixed (keep changes unstaged, default), --hard (discard all changes). BE CAREFUL with --hard!"},
        {q: ["git remote", "add remote git", "remote repository"], a: "Git remote: git remote -v (view), git remote add origin url (add), git remote remove origin (remove). Manages remote repos."},
        {q: ["git fork vs clone", "fork vs clone", "difference fork clone"], a: "Clone: copies repo to local. Fork: copies repo to your GitHub account, then clone. Fork for contributing to others' projects!"},
    ],


        // 5. MATH CALCULATIONS (MASSIVELY EXPANDED)
    calculations: [
        {q: ["calculate", "do math", "solve this", "compute", "work out", "figure out"], a: "I can help explain math concepts! For precise calculations, use a calculator. What math problem are you working on?"},
        {q: ["what is 2 plus 2", "2+2", "two plus two", "2 + 2"], a: "2 + 2 = 4. For more complex calculations, try a calculator app for accuracy!"},
        {q: ["what is 10 times 5", "10*5", "10 x 5", "10 times 5"], a: "10 × 5 = 50. For larger calculations, I recommend using a calculator!"},
        {q: ["what is 100 divided by 5", "100/5", "100 divided by 5"], a: "100 ÷ 5 = 20. Division splits a number into equal parts!"},
        {q: ["what is 7 minus 3", "7-3", "7 minus 3"], a: "7 - 3 = 4. Subtraction finds the difference between numbers!"},
        {q: ["square root of 16", "sqrt 16", "√16"], a: "√16 = 4. The square root of 16 is 4 because 4 × 4 = 16."},
        {q: ["square root of 25", "sqrt 25", "√25"], a: "√25 = 5 because 5 × 5 = 25."},
        {q: ["square root of 9", "sqrt 9", "√9"], a: "√9 = 3 because 3 × 3 = 9."},
        {q: ["what is 2 squared", "2^2", "2 to the power of 2"], a: "2² = 4. Squaring means multiplying by itself: 2 × 2 = 4."},
        {q: ["what is 3 cubed", "3^3", "3 to the power of 3"], a: "3³ = 27. Cubing means three factors: 3 × 3 × 3 = 27."},
        {q: ["how to calculate percentage", "percentage formula", "calculate percent"], a: "Percentage formula: (part/whole) × 100. Example: 25 out of 100 = (25/100) × 100 = 25%. Or: value × (percent/100) = result."},
        {q: ["what is 20 percent of 100", "20% of 100", "calculate 20 percent"], a: "20% of 100 = 100 × 0.20 = 20. Convert percent to decimal (20% = 0.20), multiply!"},
        {q: ["how to calculate average", "mean calculation", "find average"], a: "Average (mean): Add all numbers, divide by count. Example: (2+4+6)/3 = 12/3 = 4. Sum of values ÷ number of values."},
        {q: ["how to find median", "median calculation", "what is median"], a: "Median: Middle value when sorted. Odd count: middle number. Even count: average of two middle numbers. Example: [1,3,5] → 3"},
        {q: ["how to find mode", "mode calculation", "what is mode"], a: "Mode: Most frequently occurring value. Example: [1,2,2,3,4] → mode is 2. Can have multiple modes or none!"},
        {q: ["circumference of circle", "circle circumference formula", "find circumference"], a: "Circumference = 2πr or πd, where r is radius, d is diameter (d=2r). Use π ≈ 3.14159. Example: r=5 → C = 2π(5) ≈ 31.42"},
        {q: ["area of circle", "circle area formula", "find circle area"], a: "Area of circle = πr², where r is radius. Example: radius 5 → Area = π × 5² = 25π ≈ 78.54 square units."},
        {q: ["area of triangle", "triangle area formula", "find triangle area"], a: "Triangle area = (base × height) / 2. Example: base 6, height 4 → Area = (6 × 4) / 2 = 12 square units."},
        {q: ["area of rectangle", "rectangle area", "find rectangle area"], a: "Rectangle area = length × width. Example: 5 × 3 = 15 square units. Perimeter = 2(length + width) = 2(5+3) = 16."},
        {q: ["area of square", "square area", "find square area"], a: "Square area = side². Example: side 4 → Area = 4² = 16 square units. All sides equal in square!"},
        {q: ["perimeter of rectangle", "rectangle perimeter"], a: "Perimeter = 2(length + width) or 2l + 2w. Example: length 5, width 3 → P = 2(5+3) = 16 units."},
        {q: ["perimeter of square", "square perimeter"], a: "Perimeter = 4 × side. Example: side 5 → P = 4 × 5 = 20 units. Sum of all sides!"},
        {q: ["volume of cube", "cube volume", "find cube volume"], a: "Cube volume = side³. Example: side 4 → Volume = 4³ = 64 cubic units. All sides equal in cube."},
        {q: ["volume of sphere", "sphere volume", "find sphere volume"], a: "Sphere volume = (4/3)πr³, where r is radius. Surface area = 4πr². Use π ≈ 3.14159."},
        {q: ["volume of cylinder", "cylinder volume"], a: "Cylinder volume = πr²h, where r is radius, h is height. Example: r=3, h=5 → V = π(3²)(5) = 45π ≈ 141.37"},
        {q: ["volume of cone", "cone volume"], a: "Cone volume = (1/3)πr²h. One-third of cylinder volume! Example: r=3, h=5 → V = (1/3)π(9)(5) = 15π ≈ 47.12"},
        {q: ["pythagorean theorem", "pythagoras theorem", "right triangle"], a: "Pythagorean theorem: a² + b² = c², where c is hypotenuse. Example: sides 3,4 → 3² + 4² = 9 + 16 = 25 = 5². Hypotenuse = 5."},
        {q: ["quadratic formula", "solve quadratic equation", "quadratic equation"], a: "Quadratic formula: x = (-b ± √(b²-4ac)) / 2a for ax² + bx + c = 0. Gives 0, 1, or 2 solutions depending on discriminant!"},
        {q: ["distance formula", "distance between points", "find distance"], a: "Distance = √((x₂-x₁)² + (y₂-y₁)²) between points (x₁,y₁) and (x₂,y₂). Pythagorean theorem in coordinates!"},
        {q: ["slope formula", "calculate slope", "find slope"], a: "Slope = (y₂-y₁)/(x₂-x₁) = rise/run. Measures steepness. Positive = upward, negative = downward, 0 = horizontal, undefined = vertical."},
        {q: ["midpoint formula", "find midpoint", "midpoint calculation"], a: "Midpoint = ((x₁+x₂)/2, (y₁+y₂)/2). Average of x-coordinates and y-coordinates. Center point between two points!"},
        {q: ["factorial", "what is factorial", "factorial formula", "n factorial"], a: "Factorial (n!) = n × (n-1) × (n-2) × ... × 1. Example: 5! = 5×4×3×2×1 = 120. 0! = 1 by definition!"},
        {q: ["permutation formula", "permutation calculation", "how to calculate permutation"], a: "Permutations P(n,r) = n!/(n-r)! - order matters. Example: P(5,3) = 5!/(5-3)! = 5!/2! = 120/2 = 60 ways to arrange 3 from 5."},
        {q: ["combination formula", "combination calculation", "how to calculate combination"], a: "Combinations C(n,r) = n!/(r!(n-r)!) - order doesn't matter. Example: C(5,3) = 5!/(3!2!) = 120/12 = 10 ways to choose 3 from 5."},
        {q: ["convert celsius to fahrenheit", "c to f", "celsius to fahrenheit"], a: "Celsius to Fahrenheit: F = (C × 9/5) + 32. Examples: 0°C = 32°F, 20°C = 68°F, 100°C = 212°F. Freezing = 32°F, boiling = 212°F."},
        {q: ["convert fahrenheit to celsius", "f to c", "fahrenheit to celsius"], a: "Fahrenheit to Celsius: C = (F - 32) × 5/9. Examples: 32°F = 0°C, 68°F = 20°C, 212°F = 100°C."},
        {q: ["convert km to miles", "kilometers to miles", "km to mi"], a: "Kilometers to miles: multiply by 0.621371. Examples: 5 km ≈ 3.11 miles, 10 km ≈ 6.21 miles. Miles to km: multiply by 1.60934."},
        {q: ["convert miles to km", "miles to kilometers", "mi to km"], a: "Miles to kilometers: multiply by 1.60934. Examples: 5 miles ≈ 8.05 km, 10 miles ≈ 16.09 km."},
        {q: ["convert pounds to kg", "lbs to kg", "pounds to kilograms"], a: "Pounds to kg: divide by 2.20462 or multiply by 0.453592. Examples: 10 lbs ≈ 4.54 kg, 150 lbs ≈ 68 kg."},
        {q: ["convert kg to pounds", "kg to lbs", "kilograms to pounds"], a: "Kg to pounds: multiply by 2.20462. Examples: 5 kg ≈ 11 lbs, 70 kg ≈ 154 lbs."},
        {q: ["convert feet to meters", "ft to m", "feet to meters"], a: "Feet to meters: multiply by 0.3048. Examples: 5 ft ≈ 1.52 m, 10 ft ≈ 3.05 m. Meters to feet: multiply by 3.28084."},
        {q: ["convert inches to cm", "inches to centimeters", "in to cm"], a: "Inches to cm: multiply by 2.54. Examples: 10 inches = 25.4 cm, 12 inches = 30.48 cm. Cm to inches: divide by 2.54."},
        {q: ["fractions to decimals", "convert fraction to decimal", "fraction decimal"], a: "Fraction to decimal: divide numerator by denominator. Examples: 1/2 = 0.5, 1/4 = 0.25, 3/4 = 0.75, 1/3 ≈ 0.333..."},
        {q: ["decimals to fractions", "convert decimal to fraction", "decimal fraction"], a: "Decimal to fraction: 0.5 = 1/2, 0.25 = 1/4, 0.75 = 3/4, 0.2 = 1/5. Count decimal places for denominator!"},
        {q: ["order of operations", "pemdas", "bodmas", "math order"], a: "Order: PEMDAS/BODMAS - Parentheses/Brackets, Exponents/Orders, Multiplication & Division (left to right), Addition & Subtraction (left to right)."},
    ],


    // 6. SCIENCE (FULLY EXPANDED - Physics, Chemistry, Biology, Earth, Space)
    science: [
        // Physics
        {q: ["what is gravity", "explain gravity", "gravity force", "how does gravity work"], a: "Gravity is a natural phenomenon by which objects with mass attract each other. Earth's gravity keeps us on the ground and the Moon in orbit. Formula: F = G(m1×m2)/r²"},
        {q: ["what is energy", "explain energy", "types of energy"], a: "Energy is the capacity to do work or produce change, existing in forms like kinetic (motion), potential (stored), thermal (heat), chemical, nuclear, electrical."},
        {q: ["what is matter", "explain matter", "states of matter"], a: "Matter is anything that has mass and takes up space. It exists in states: solid (fixed shape), liquid (fixed volume), gas (expands), plasma (ionized)."},
        {q: ["what is the speed of light", "light speed", "how fast is light"], a: "The speed of light in vacuum is approximately 299,792,458 meters per second (about 186,282 miles per second), the universe's ultimate speed limit!"},
        {q: ["newton's first law", "law of inertia", "newton first law"], a: "Newton's First Law (Inertia): An object at rest stays at rest and an object in motion stays in motion with constant velocity unless acted upon by external force."},
        {q: ["newton's second law", "f equals ma", "newton second law"], a: "Newton's Second Law: Force equals mass times acceleration (F=ma). Heavier objects need more force to accelerate. Relates force, mass, and acceleration."},
        {q: ["newton's third law", "action reaction", "newton third law"], a: "Newton's Third Law: For every action, there's an equal and opposite reaction. When you push wall, wall pushes back equally!"},
        {q: ["what is thermodynamics", "explain thermodynamics", "laws of thermodynamics"], a: "Thermodynamics studies heat, energy, and work. Laws: 1) Energy conserved, 2) Entropy increases, 3) Absolute zero unreachable. Foundation of physics!"},
        {q: ["what is electricity", "explain electricity", "electric current"], a: "Electricity is the flow of electrical charge, typically carried by electrons moving through conductors like wires. Measured in amperes (A)."},
        {q: ["what is magnetism", "explain magnetism", "magnetic force"], a: "Magnetism is a force that attracts or repels certain materials (iron, nickel, cobalt), caused by motion of electric charges. Magnets have north and south poles."},
        {q: ["what are waves", "explain waves", "types of waves"], a: "Waves are disturbances transferring energy through matter or space. Types: mechanical (sound, water) need medium, electromagnetic (light, radio) don't."},
        {q: ["what is sound", "explain sound", "how sound works"], a: "Sound is a vibration traveling through air or other mediums as longitudinal waves, detected by ears. Travels at ~343 m/s in air. Needs medium!"},
        {q: ["what is light", "explain light", "electromagnetic radiation"], a: "Light is electromagnetic radiation visible to human eye (380-700nm wavelength), traveling at 3×10⁸ m/s in vacuum. Both wave and particle properties!"},
        {q: ["theory of relativity", "einstein relativity", "special relativity"], a: "Einstein's relativity: Special (1905) - space/time relative, nothing faster than light. General (1915) - gravity curves spacetime. Revolutionary physics!"},
        {q: ["what is quantum physics", "quantum mechanics", "quantum theory"], a: "Quantum physics studies atomic/subatomic behavior where particles act probabilistically. Key concepts: wave-particle duality, uncertainty principle, superposition."},
        {q: ["what is a photon", "explain photon", "light particle"], a: "A photon is a particle of light and basic unit of electromagnetic radiation. No mass, moves at light speed, has both wave and particle properties!"},
        {q: ["what is mass", "explain mass", "mass vs weight"], a: "Mass is the amount of matter in object, measured in kg. Constant everywhere. Determines inertia (resistance to acceleration). Not same as weight!"},
        {q: ["what is weight", "explain weight", "weight vs mass"], a: "Weight is force exerted on object by gravity, equal to mass × gravitational acceleration (W=mg). Varies with location. Measured in newtons (N)."},
        {q: ["what is velocity", "explain velocity", "velocity vs speed"], a: "Velocity is rate of change of position with direction. Vector quantity. Speed is magnitude only. Example: 50 mph north (velocity), 50 mph (speed)."},
        {q: ["what is acceleration", "explain acceleration"], a: "Acceleration is rate of change of velocity over time, measured in m/s². Can be speeding up, slowing down, or changing direction. a = Δv/Δt"},
        {q: ["what is friction", "explain friction", "types of friction"], a: "Friction is force opposing motion between surfaces in contact, converting kinetic energy to heat. Types: static (at rest), kinetic (moving), rolling."},
        {q: ["what is momentum", "explain momentum", "conservation of momentum"], a: "Momentum = mass × velocity (p=mv). Conserved in closed systems. Harder to stop objects with more momentum. Vector quantity!"},
        {q: ["what is force", "explain force", "types of forces"], a: "Force is push or pull causing acceleration, measured in newtons (N). Types: gravity, friction, normal, tension, applied. F=ma (Newton's 2nd law)."},
        {q: ["what is work", "work in physics", "work formula"], a: "Work = force × distance × cos(angle) (W=Fd). Energy transferred by force moving object. Measured in joules (J). No movement = no work!"},
        {q: ["what is power", "explain power", "power formula"], a: "Power is rate of doing work: Power = work/time or P = energy/time. Measured in watts (W). 1 watt = 1 joule/second."},
        {q: ["kinetic energy", "kinetic energy formula"], a: "Kinetic energy = (1/2)mv², energy of motion. Depends on mass and velocity. Faster/heavier = more KE. Example: moving car has kinetic energy."},
        {q: ["potential energy", "potential energy formula"], a: "Potential energy is stored energy. Gravitational: PE = mgh (mass × gravity × height). Elastic: springs. Chemical: bonds. Can convert to kinetic!"},
        
        // Chemistry
        {q: ["what is an atom", "explain atom", "atomic structure"], a: "An atom is smallest unit of matter retaining element properties. Structure: nucleus (protons+neutrons) surrounded by electrons in shells. Mostly empty space!"},
        {q: ["what is a molecule", "explain molecule", "molecule vs atom"], a: "A molecule is two or more atoms chemically bonded together. Can be same element (O₂) or different (H₂O). Smallest unit of compound."},
        {q: ["what is the periodic table", "periodic table", "periodic table elements"], a: "Periodic table organizes 118 elements by atomic number and properties. Rows = periods, columns = groups. Shows patterns: metals left, nonmetals right!"},
        {q: ["what is an element", "explain element", "chemical element"], a: "An element is pure substance of only one type of atom, cannot be broken down chemically. 118 known elements. Examples: gold, oxygen, carbon."},
        {q: ["what is a compound", "explain compound", "compound vs element"], a: "A compound is substance formed when 2+ elements chemically bond in fixed proportions. Can be broken down into elements. Examples: H₂O, CO₂, NaCl."},
        {q: ["what is a chemical reaction", "chemical reaction", "types of reactions"], a: "Chemical reaction transforms substances (reactants) into different substances (products) by breaking/forming bonds. Types: synthesis, decomposition, combustion, redox."},
        {q: ["what is acid", "explain acid", "acidic"], a: "An acid donates hydrogen ions (H⁺) in solution, tastes sour, pH < 7. Examples: HCl (hydrochloric), H₂SO₄ (sulfuric), citric acid (lemons)."},
        {q: ["what is base", "explain base", "basic alkaline"], a: "A base accepts H⁺ or donates OH⁻ ions, feels slippery, pH > 7. Also called alkaline. Examples: NaOH (sodium hydroxide), NH₃ (ammonia)."},
        {q: ["what is ph", "ph scale", "ph levels"], a: "pH measures acidity/basicity on 0-14 scale. 7 = neutral (water), <7 = acidic, >7 = basic. Each unit is 10× difference! Logarithmic scale."},
        {q: ["what is water", "h2o", "water molecule"], a: "Water (H₂O) is molecule of 2 hydrogen + 1 oxygen atom. Polar molecule, universal solvent, essential for life. Unique properties: surface tension, high heat capacity!"},
        {q: ["what is oxygen", "explain oxygen", "o2"], a: "Oxygen is element (O, atomic #8) essential for respiration in most organisms. Makes ~21% of Earth's atmosphere. O₂ (diatomic) is breathable form."},
        {q: ["what is carbon", "explain carbon", "carbon element"], a: "Carbon (C, atomic #6) forms basis of all organic compounds and life. Can form 4 bonds, creates long chains. Found in all living things!"},
        {q: ["what is hydrogen", "explain hydrogen", "h2"], a: "Hydrogen (H, atomic #1) is lightest and most abundant element in universe. Combines with oxygen to form water. H₂ is diatomic gas."},
        {q: ["what is nitrogen", "explain nitrogen", "n2"], a: "Nitrogen (N, atomic #7) makes ~78% of Earth's atmosphere. Essential for proteins and DNA. N₂ is inert gas, but nitrogen compounds are reactive!"},
        {q: ["what is salt", "sodium chloride", "nacl"], a: "Table salt is sodium chloride (NaCl), ionic compound of Na⁺ and Cl⁻ ions. Formed from acid-base neutralization. Essential for life!"},
        {q: ["what is oxidation", "oxidation reduction", "redox"], a: "Oxidation is loss of electrons (LEO), often gains oxygen. Reduction is gain of electrons (GER), often loses oxygen. Always occur together (redox)!"},
        {q: ["what is ion", "explain ion", "cation anion"], a: "Ion is atom/molecule with electric charge from gaining/losing electrons. Cation = positive (loses e⁻), anion = negative (gains e⁻). Example: Na⁺, Cl⁻"},
        {q: ["what is covalent bond", "covalent bonding"], a: "Covalent bond forms when atoms share electrons. Forms molecules. Strong bonds. Examples: H₂, O₂, H₂O. Nonmetals bond covalently!"},
        {q: ["what is ionic bond", "ionic bonding"], a: "Ionic bond forms when electron transfers from metal to nonmetal, creating ions that attract. Example: Na⁺Cl⁻ (table salt). Strong electrostatic attraction!"},
        {q: ["what is electron", "explain electron"], a: "Electron is negatively charged particle orbiting atom's nucleus. Nearly massless (1/1836 proton mass). Determines chemical bonding and reactions!"},
        {q: ["what is proton", "explain proton"], a: "Proton is positively charged particle in nucleus. Mass ≈ neutron. Number of protons = atomic number = defines element. Example: 1 proton = hydrogen!"},
        {q: ["what is neutron", "explain neutron"], a: "Neutron is neutral (no charge) particle in nucleus. Mass ≈ proton. Different neutron numbers = isotopes. Provides nuclear stability!"},
        
        // Biology  
        {q: ["what is dna", "explain dna", "deoxyribonucleic acid"], a: "DNA (Deoxyribonucleic Acid) is double helix molecule carrying genetic instructions for development, functioning, and reproduction. Made of nucleotides (A, T, G, C)."},
        {q: ["what is a cell", "explain cell", "cell biology"], a: "Cell is basic structural and functional unit of all living organisms. Smallest unit performing all life processes. Types: prokaryotic (no nucleus), eukaryotic (nucleus)."},
        {q: ["what is photosynthesis", "explain photosynthesis", "photosynthesis process"], a: "Photosynthesis: Plants use sunlight, water (H₂O), and CO₂ to create glucose (C₆H₁₂O₆) and oxygen (O₂). Equation: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂"},
        {q: ["what is evolution", "explain evolution", "theory of evolution"], a: "Evolution is process by which species change over time through natural selection and genetic variation, adapting to environment. Proposed by Charles Darwin."},
        {q: ["what is natural selection", "explain natural selection", "survival of the fittest"], a: "Natural selection: Organisms with advantageous traits survive and reproduce more. 'Survival of the fittest'. Drives evolution over generations!"},
        {q: ["what is mitosis", "explain mitosis", "cell division"], a: "Mitosis is cell division producing 2 identical daughter cells from single parent. Stages: prophase, metaphase, anaphase, telophase (PMAT). Used for growth/repair."},
        {q: ["what is meiosis", "explain meiosis", "sex cell division"], a: "Meiosis is cell division producing 4 sex cells (gametes) with half the chromosomes (haploid). Two divisions. Creates genetic diversity for reproduction!"},
        {q: ["what are genes", "explain genes", "genetics"], a: "Genes are DNA segments containing instructions for building proteins, determining inherited traits. Passed from parents to offspring. Humans have ~20,000-25,000 genes!"},
        {q: ["what is rna", "explain rna", "ribonucleic acid"], a: "RNA (Ribonucleic Acid) helps translate genetic info from DNA into proteins. Types: mRNA (messenger), tRNA (transfer), rRNA (ribosomal). Single-stranded."},
        {q: ["what is protein", "explain protein", "proteins"], a: "Proteins are large molecules made of amino acid chains. Perform most cell functions: enzymes (catalysts), structure, transport, signaling, defense."},
        {q: ["what is metabolism", "explain metabolism", "metabolic processes"], a: "Metabolism is all chemical reactions in organisms converting food to energy and building materials. Anabolism (building), catabolism (breaking down)."},
        {q: ["what is respiration", "cellular respiration", "aerobic respiration"], a: "Cellular respiration: Cells convert glucose + oxygen → ATP energy + CO₂ + H₂O. Opposite of photosynthesis! Equation: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP"},
        {q: ["what is an ecosystem", "explain ecosystem", "ecosystems"], a: "Ecosystem is community of living organisms (biotic) interacting with physical environment (abiotic). Includes energy flow and nutrient cycling!"},
        {q: ["what is biodiversity", "explain biodiversity", "biological diversity"], a: "Biodiversity is variety of life on Earth: diversity of species, genes, and ecosystems. Essential for ecosystem health and resilience. Threatened by human activity."},
        {q: ["what is osmosis", "explain osmosis", "osmosis process"], a: "Osmosis is movement of water molecules through semi-permeable membrane from low to high solute concentration. Passive transport. Important for cells!"},
        {q: ["what is diffusion", "explain diffusion"], a: "Diffusion is movement of particles from high to low concentration until equilibrium. Passive (no energy). Example: perfume spreading in room!"},
        {q: ["what is an organ", "explain organ", "organs"], a: "Organ is collection of tissues working together for specific function. Examples: heart (pump blood), lungs (gas exchange), brain (control center)."},
        {q: ["what is the heart", "explain heart", "heart function"], a: "Heart is muscular organ pumping blood through circulatory system, delivering oxygen and nutrients, removing waste. 4 chambers: 2 atria, 2 ventricles. Beats ~100,000 times/day!"},
        {q: ["what are lungs", "explain lungs", "lung function"], a: "Lungs are organs for gas exchange: inhale O₂ (oxygen), exhale CO₂ (carbon dioxide). Contain millions of alveoli for efficient exchange. Expand/contract with breathing!"},
        {q: ["what is the brain", "explain brain", "brain function"], a: "Brain is control center of nervous system. Processes sensory info, controls movement, thoughts, emotions, memory. Parts: cerebrum, cerebellum, brainstem. ~86 billion neurons!"},
        {q: ["what is blood", "explain blood", "blood components"], a: "Blood is fluid transporting O₂, nutrients, hormones, and waste. Components: red blood cells (O₂), white blood cells (immunity), platelets (clotting), plasma (liquid)."},
        {q: ["what are chromosomes", "explain chromosomes"], a: "Chromosomes are thread-like structures of DNA and protein carrying genetic info. Humans have 46 (23 pairs) in most cells, 23 in sex cells."},
        {q: ["what is bacteria", "explain bacteria", "bacterial cells"], a: "Bacteria are single-celled prokaryotic organisms. Can be beneficial (gut bacteria, yogurt) or harmful (pathogens causing disease). Reproduce by binary fission!"},
        {q: ["what is virus", "explain virus", "viruses"], a: "Virus is tiny infectious agent that replicates only inside living cells. Not technically alive. Contains DNA or RNA in protein coat. Causes diseases like flu, COVID-19."},
        {q: ["what is photosynthesis equation", "photosynthesis formula"], a: "Photosynthesis: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. Carbon dioxide + water + light → glucose + oxygen. Occurs in chloroplasts!"},
        
        // Earth Science
        {q: ["what causes seasons", "why seasons", "seasons earth"], a: "Seasons are caused by Earth's 23.5° tilted axis as it orbits Sun. Tilt changes sunlight angle and amount different regions receive. Not caused by distance from Sun!"},
        {q: ["what is climate change", "global warming", "climate crisis"], a: "Climate change refers to long-term shifts in temperatures and weather patterns, primarily caused by human activities (burning fossil fuels, deforestation). Leads to warming, extreme weather."},
        {q: ["what causes earthquakes", "earthquake", "how earthquakes happen"], a: "Earthquakes are caused by sudden energy release in Earth's crust, usually from tectonic plate movement along fault lines. Seismic waves radiate from epicenter!"},
        {q: ["what causes volcanoes", "volcano", "volcanic eruption"], a: "Volcanoes form when magma from Earth's mantle rises through crust and erupts. Often at tectonic plate boundaries: subduction zones or divergent boundaries, and hotspots."},
        {q: ["what causes lightning", "lightning", "how lightning forms"], a: "Lightning is caused by electrical charge buildup in clouds. Ice particles collide, create charge separation, discharge as lightning bolt. 5× hotter than Sun's surface!"},
        {q: ["what causes thunder", "thunder", "why thunder follows lightning"], a: "Thunder is sound from lightning rapidly heating and expanding air, creating sonic shock wave. Light travels faster than sound, so see lightning before hearing thunder!"},
        {q: ["what causes rain", "how does rain form", "rain formation"], a: "Rain forms when water vapor in clouds condenses into droplets that grow heavy enough to fall. Water cycle: evaporation → condensation → precipitation!"},
        {q: ["what are clouds", "explain clouds", "cloud formation"], a: "Clouds are visible masses of water droplets or ice crystals suspended in atmosphere. Form when air cools and water vapor condenses. Types: cumulus, stratus, cirrus!"},
        {q: ["what is the water cycle", "explain water cycle", "hydrologic cycle"], a: "Water cycle: continuous movement of water. Evaporation (liquid→gas) → Condensation (gas→liquid) → Precipitation (rain/snow) → Collection → repeat!"},
        {q: ["what are rocks", "explain rocks", "types of rocks"], a: "Rocks are solid mixtures of minerals. 3 types: Igneous (cooled magma), Sedimentary (compressed sediment), Metamorphic (heat/pressure transformed). Rock cycle!"},
        {q: ["what are minerals", "explain minerals", "mineral vs rock"], a: "Minerals are naturally occurring inorganic solids with definite chemical composition and crystalline structure. Rocks are made of minerals. Examples: quartz, feldspar, calcite."},
        {q: ["what is plate tectonics", "tectonic plates", "continental drift"], a: "Plate tectonics: Earth's lithosphere divided into large plates that move on asthenosphere. Causes earthquakes, volcanoes, mountains. Types: convergent, divergent, transform boundaries!"},
        {q: ["layers of earth", "earth structure", "earth layers"], a: "Earth layers (out to in): Crust (thin, solid), Mantle (thick, semi-solid), Outer Core (liquid iron/nickel), Inner Core (solid iron/nickel). Gets hotter and denser!"},
        {q: ["what is atmosphere", "earth atmosphere", "atmospheric layers"], a: "Atmosphere is layer of gases surrounding Earth. Layers (low to high): Troposphere (weather), Stratosphere (ozone), Mesosphere, Thermosphere, Exosphere. 78% N₂, 21% O₂!"},
        {q: ["what is ozone layer", "ozone layer", "stratosphere"], a: "Ozone layer (O₃) in stratosphere absorbs harmful UV radiation from Sun. Protects life on Earth. Depleted by CFCs, but recovering since Montreal Protocol!"},
        {q: ["what is greenhouse effect", "greenhouse gases"], a: "Greenhouse effect: Gases (CO₂, CH₄, H₂O) trap heat in atmosphere, warming Earth. Natural process essential for life, but enhanced by human emissions causing global warming!"},
        
        // Space/Astronomy
        {q: ["what is the big bang", "big bang theory", "origin of universe"], a: "Big Bang theory: Universe began as extremely hot, dense point ~13.8 billion years ago, then expanded rapidly. Evidence: cosmic background radiation, galaxy expansion, element abundance!"},
        {q: ["what is a black hole", "explain black hole", "black holes"], a: "Black hole is region in space where gravity is so strong nothing can escape, not even light. Formed from massive star collapse. Event horizon = point of no return!"},
        {q: ["what is a star", "explain star", "how stars work"], a: "Star is massive ball of hot plasma (mostly hydrogen) held together by gravity, producing energy through nuclear fusion in core. Converts H to He, releases energy as light!"},
        {q: ["what is a galaxy", "explain galaxy", "types of galaxies"], a: "Galaxy is massive system of stars, gas, dust, and dark matter held by gravity. Contains billions-trillions of stars. Types: spiral (Milky Way), elliptical, irregular!"},
        {q: ["what is a planet", "explain planet", "planet definition"], a: "Planet is celestial body orbiting star, massive enough for gravity to make it round, but not massive enough for fusion. Must clear its orbital path!"},
        {q: ["what is a comet", "explain comet", "comets"], a: "Comet is icy celestial body that releases gas and dust forming visible tail when passing near Sun. 'Dirty snowball'. Tail points away from Sun!"},
        {q: ["what is an asteroid", "explain asteroid", "asteroids"], a: "Asteroid is small rocky object orbiting Sun. Most in asteroid belt between Mars and Jupiter. Differ from comets (rocky vs icy). Can be hazardous to Earth!"},
        {q: ["what is a meteor", "shooting star", "meteor vs meteorite"], a: "Meteor is streak of light from space rock burning up in atmosphere. 'Shooting star'. Meteoroid (space), meteor (burning), meteorite (reaches ground)!"},
        {q: ["what is nebula", "explain nebula", "nebulae"], a: "Nebula is cloud of gas and dust in space. Stellar nursery where stars born! Types: emission, reflection, dark. Famous: Orion, Eagle, Crab nebulae!"},
        {q: ["what is supernova", "explain supernova", "star explosion"], a: "Supernova is massive explosion of dying massive star, briefly outshining entire galaxy. Creates heavy elements, can form neutron stars or black holes. Spectacular cosmic event!"},
        {q: ["what is dark matter", "explain dark matter"], a: "Dark matter is invisible matter making up ~85% of universe's matter. Doesn't emit light or energy. Detected by gravitational effects on visible matter. Still mysterious!"},
        {q: ["what is dark energy", "explain dark energy"], a: "Dark energy is mysterious force causing universe's expansion to accelerate. Makes up ~68% of universe. Nobody fully understands it yet - major physics mystery!"},
    ],


    // 7. MATHEMATICS (FULLY EXPANDED)
    math: [
        {q: ["what is math", "what is mathematics", "mathematics"], a: "Mathematics is study of numbers, quantities, shapes, patterns, and their relationships using logic and abstraction. Universal language of science!"},
        {q: ["what is pi", "value of pi", "pi number"], a: "Pi (π) ≈ 3.14159... is ratio of circle's circumference to diameter. Irrational number (infinite non-repeating decimals). Essential in geometry and trigonometry!"},
        {q: ["what is e", "euler's number", "e number"], a: "e ≈ 2.71828... is Euler's number, base of natural logarithm. Appears in calculus, compound interest, probability. Irrational and transcendental!"},
        {q: ["what is algebra", "explain algebra"], a: "Algebra is branch of math using symbols and letters to represent numbers in equations and formulas. Solves for unknown values. Foundation for higher math!"},
        {q: ["what is calculus", "explain calculus", "differential integral"], a: "Calculus studies continuous change. Differential calculus (derivatives, rates of change). Integral calculus (integrals, accumulation, area under curve). Essential for physics, engineering!"},
        {q: ["what is geometry", "explain geometry"], a: "Geometry is branch of math concerned with shapes, sizes, positions, angles, dimensions, and properties of space. Studies points, lines, planes, solids!"},
        {q: ["what is trigonometry", "explain trigonometry", "trig"], a: "Trigonometry studies relationships between angles and sides of triangles. Key functions: sine, cosine, tangent. Essential for navigation, engineering, physics!"},
        {q: ["what is statistics", "explain statistics"], a: "Statistics is science of collecting, analyzing, interpreting, and presenting data. Includes mean, median, mode, standard deviation, probability distributions!"},
        {q: ["what is probability", "explain probability"], a: "Probability is measure of likelihood an event will occur, expressed as number between 0 (impossible) and 1 (certain), or 0% to 100%. P(event) = favorable/total outcomes."},
        {q: ["what is a prime number", "prime number", "prime numbers"], a: "Prime number is natural number > 1 with no positive divisors except 1 and itself. Examples: 2, 3, 5, 7, 11, 13, 17, 19, 23... Only 2 is even prime!"},
        {q: ["what is zero", "explain zero", "number zero"], a: "Zero (0) represents nothing or null value. Additive identity (x+0=x). Neither positive nor negative. Placeholder in positional notation. Cannot divide by zero!"},
        {q: ["what is infinity", "explain infinity", "∞"], a: "Infinity (∞) represents unbounded quantity larger than any number. Not a real number. Used in limits, calculus, set theory. Different 'sizes' of infinity exist!"},
        {q: ["what is fibonacci sequence", "fibonacci", "fibonacci numbers"], a: "Fibonacci sequence: Each number is sum of previous two. 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55... Appears in nature: shells, flowers, spirals!"},
        {q: ["what is golden ratio", "phi", "golden ratio"], a: "Golden ratio φ (phi) ≈ 1.618... appears in Fibonacci sequence (ratio of consecutive terms). Found in art, architecture, nature. Aesthetically pleasing proportions!"},
        {q: ["pythagorean theorem", "pythagoras theorem", "a squared b squared"], a: "Pythagorean theorem: In right triangle, a² + b² = c² where c is hypotenuse. Only for right triangles! Example: 3-4-5 triangle (3²+4²=9+16=25=5²)"},
        {q: ["what is fraction", "explain fraction", "fractions"], a: "Fraction represents part of whole, written as numerator/denominator (top/bottom). Example: 3/4 = 3 parts out of 4. Can be proper (<1), improper (≥1), or mixed."},
        {q: ["what is percentage", "explain percentage", "percent"], a: "Percentage is fraction expressed as part per 100, denoted by %. 50% = 50/100 = 0.5 = half. To convert: decimal × 100 = percentage!"},
        {q: ["what is decimal", "explain decimal", "decimal number"], a: "Decimal is number expressed in base-10 with decimal point separating whole and fractional parts. Example: 3.14, 0.5, 12.75. Position determines place value!"},
        {q: ["what is an equation", "explain equation"], a: "Equation is mathematical statement asserting two expressions are equal, containing = sign. Examples: 2x + 3 = 7, E = mc². Solve for unknown variables!"},
        {q: ["what is addition", "explain addition", "adding"], a: "Addition (+) is arithmetic operation combining two or more numbers to find total or sum. Commutative: a+b = b+a. Identity: x+0 = x."},
        {q: ["what is subtraction", "explain subtraction", "subtracting"], a: "Subtraction (-) is arithmetic operation finding difference between numbers by removing one quantity from another. Inverse of addition. Not commutative: a-b ≠ b-a!"},
        {q: ["what is multiplication", "explain multiplication", "multiplying", "times"], a: "Multiplication (×) represents repeated addition, finding product. Commutative: a×b = b×a. Identity: x×1 = x. Zero property: x×0 = 0."},
        {q: ["what is division", "explain division", "dividing"], a: "Division (÷) splits number into equal parts or finds how many times one number contains another. Inverse of multiplication. Cannot divide by zero!"},
        {q: ["what is square root", "explain square root", "sqrt"], a: "Square root (√) of number is value that, when multiplied by itself, gives original number. √9 = 3 because 3×3 = 9. Every positive number has 2 roots: ±3!"},
        {q: ["what is exponent", "explain exponent", "powers"], a: "Exponent indicates how many times base is multiplied by itself. Written as superscript: 2³ = 2×2×2 = 8. Rules: x⁰=1, x¹=x, x^m × x^n = x^(m+n)"},
        {q: ["what is logarithm", "explain logarithm", "log"], a: "Logarithm is inverse of exponentiation. log_b(x) = y means b^y = x. Example: log₁₀(100) = 2 because 10² = 100. Natural log (ln) uses base e!"},
        {q: ["what is absolute value", "explain absolute value"], a: "Absolute value |x| is distance from zero, always non-negative. |5| = 5, |-5| = 5, |0| = 0. Removes negative sign. Denoted by vertical bars!"},
        {q: ["what is rational number", "rational vs irrational"], a: "Rational number can be expressed as fraction p/q (integers). Examples: 1/2, 5, -3, 0.75. Irrational can't: √2, π, e. Decimals: rational repeats or terminates!"},
        {q: ["what is complex number", "imaginary number", "complex numbers"], a: "Complex number has form a + bi where i = √(-1). Real part (a) + imaginary part (bi). Used in engineering, physics, signal processing!"},
        {q: ["what is derivative", "calculus derivative"], a: "Derivative measures rate of change (slope) of function at point. f'(x) or df/dx. Instantaneous rate. Example: velocity is derivative of position!"},
        {q: ["what is integral", "calculus integral"], a: "Integral finds area under curve or accumulation. Antiderivative. Definite integral (∫[a,b]) has limits. Indefinite (∫) includes constant +C. Opposite of derivative!"},
    ],


// 8. WORLD GEOGRAPHY (FULLY EXPANDED)
    geography: [
        // Country Capitals - Expanded
        {q: ["capital of france", "france capital", "paris capital"], a: "The capital of France is Paris, known for the Eiffel Tower, Louvre Museum, and rich culture!"},
        {q: ["capital of japan", "japan capital", "tokyo capital"], a: "The capital of Japan is Tokyo, one of the world's largest and most advanced metropolitan areas!"},
        {q: ["capital of usa", "usa capital", "america capital", "us capital", "united states capital"], a: "The capital of the United States is Washington, D.C. (District of Columbia)."},
        {q: ["capital of uk", "uk capital", "england capital", "britain capital"], a: "The capital of the United Kingdom is London, also capital of England."},
        {q: ["capital of germany", "germany capital", "berlin capital"], a: "The capital of Germany is Berlin, historically significant city reunited in 1990!"},
        {q: ["capital of china", "china capital", "beijing capital"], a: "The capital of China is Beijing (Peking), one of the world's oldest cities!"},
        {q: ["capital of russia", "russia capital", "moscow capital"], a: "The capital of Russia is Moscow, largest city in Europe by population!"},
        {q: ["capital of india", "india capital", "delhi capital"], a: "The capital of India is New Delhi, part of larger National Capital Territory of Delhi."},
        {q: ["capital of canada", "canada capital", "ottawa capital"], a: "The capital of Canada is Ottawa, though Toronto is larger!"},
        {q: ["capital of australia", "australia capital", "canberra capital"], a: "The capital of Australia is Canberra, not Sydney or Melbourne as many think!"},
        {q: ["capital of brazil", "brazil capital", "brasilia capital"], a: "The capital of Brazil is Brasília, a planned city built in 1960!"},
        {q: ["capital of italy", "italy capital", "rome capital"], a: "The capital of Italy is Rome (Roma), the historic Eternal City!"},
        {q: ["capital of spain", "spain capital", "madrid capital"], a: "The capital of Spain is Madrid, located in center of country!"},
        {q: ["capital of mexico", "mexico capital", "mexico city capital"], a: "The capital of Mexico is Mexico City (Ciudad de México), one of world's largest cities!"},
        {q: ["capital of egypt", "egypt capital", "cairo capital"], a: "The capital of Egypt is Cairo, largest city in Arab world and Africa!"},
        {q: ["capital of south africa", "south africa capital"], a: "South Africa has three capitals: Pretoria (executive), Cape Town (legislative), and Bloemfontein (judicial). Unique!"},
        {q: ["capital of argentina", "argentina capital", "buenos aires capital"], a: "The capital of Argentina is Buenos Aires, known as 'Paris of South America'!"},
        {q: ["capital of south korea", "south korea capital", "seoul capital"], a: "The capital of South Korea is Seoul, high-tech megacity!"},
        {q: ["capital of thailand", "thailand capital", "bangkok capital"], a: "The capital of Thailand is Bangkok (Krung Thep), vibrant Southeast Asian city!"},
        {q: ["capital of turkey", "turkey capital", "ankara capital"], a: "The capital of Turkey is Ankara, though Istanbul is more famous and populous!"},
        {q: ["capital of greece", "greece capital", "athens capital"], a: "The capital of Greece is Athens, birthplace of democracy and Western civilization!"},
        {q: ["capital of portugal", "portugal capital", "lisbon capital"], a: "The capital of Portugal is Lisbon (Lisboa), Europe's westernmost capital!"},
        {q: ["capital of netherlands", "netherlands capital", "amsterdam capital"], a: "The capital of Netherlands is Amsterdam, though government sits in The Hague!"},
        {q: ["capital of sweden", "sweden capital", "stockholm capital"], a: "The capital of Sweden is Stockholm, built on 14 islands!"},
        {q: ["capital of norway", "norway capital", "oslo capital"], a: "The capital of Norway is Oslo, surrounded by fjords and forests!"},
        
        // Continents & Oceans
        {q: ["how many continents", "number of continents", "continents list"], a: "There are 7 continents: Africa, Antarctica, Asia, Europe, North America, South America, and Oceania/Australia. Some models use 6 (combining Europe-Asia)."},
        {q: ["largest continent", "biggest continent"], a: "Asia is the largest continent, covering about 30% of Earth's land area and 60% of world population!"},
        {q: ["smallest continent", "tiniest continent"], a: "Oceania (Australia) is the smallest continent by land area."},
        {q: ["how many oceans", "number of oceans", "oceans list"], a: "There are 5 oceans: Pacific, Atlantic, Indian, Southern (Antarctic), and Arctic."},
        {q: ["largest ocean", "biggest ocean"], a: "The Pacific Ocean is largest and deepest, covering more than 30% of Earth's surface - larger than all land combined!"},
        {q: ["smallest ocean", "tiniest ocean"], a: "The Arctic Ocean is the smallest and shallowest ocean."},
        {q: ["deepest ocean", "deepest point ocean"], a: "The Pacific Ocean is deepest. Mariana Trench reaches ~11,000 meters (36,000 feet) deep - deepest point on Earth!"},
        
        // Geographic Features
        {q: ["tallest mountain", "highest mountain", "biggest mountain"], a: "Mount Everest is Earth's tallest mountain at 8,849 meters (29,032 feet) above sea level, on Nepal-Tibet border!"},
        {q: ["longest river", "longest river in world"], a: "The Nile River in Africa is generally considered longest at ~6,650 km (4,130 miles), though Amazon debates exist!"},
        {q: ["largest desert", "biggest desert"], a: "Antarctic Desert is largest desert (~14M km²). Sahara is largest hot desert (~9M km²). Deserts are defined by low precipitation!"},
        {q: ["deepest ocean", "deepest point in ocean", "mariana trench"], a: "Mariana Trench in Pacific Ocean is deepest point, reaching ~11,000 meters (36,000 feet) deep - deeper than Everest is tall!"},
        {q: ["largest lake", "biggest lake"], a: "Caspian Sea is largest lake by surface area (~371,000 km²), though called 'sea'. Lake Superior is largest freshwater by surface area!"},
        {q: ["deepest lake", "deepest lake in world"], a: "Lake Baikal in Russia is world's deepest lake (~1,642 meters) and oldest (~25 million years), containing 20% of world's fresh water!"},
        {q: ["largest island", "biggest island"], a: "Greenland is world's largest island (2.16M km²), excluding Australia which is considered a continent!"},
        {q: ["longest mountain range", "biggest mountain range"], a: "Andes in South America is longest continental mountain range (~7,000 km). Mid-Ocean Ridge is longest overall (~65,000 km underwater)!"},
        {q: ["largest waterfall", "biggest waterfall", "tallest waterfall"], a: "Angel Falls in Venezuela is tallest waterfall (979 meters). Victoria Falls has largest sheet of water. Iguazu Falls is widest!"},
        {q: ["largest rainforest", "biggest rainforest"], a: "Amazon Rainforest in South America is largest, covering ~5.5 million km². Produces 20% of world's oxygen!"},
        
        // Countries
        {q: ["largest country", "biggest country", "biggest country in world"], a: "Russia is largest country by land area (~17.1 million km²), spanning 11 time zones across Europe and Asia!"},
        {q: ["smallest country", "smallest nation", "tiniest country"], a: "Vatican City is smallest country (~0.44 km²), surrounded by Rome, Italy. Only ~800 residents!"},
        {q: ["most populated country", "most people", "biggest population"], a: "India is currently most populated country (~1.4+ billion), having recently surpassed China!"},
        {q: ["how many countries", "number of countries", "countries in world"], a: "There are 195 countries: 193 UN member states plus Vatican City and Palestine (observer states)."},
        {q: ["richest country", "wealthiest country", "highest gdp"], a: "By GDP: USA (~$25T). By GDP per capita: Luxembourg or Qatar. Depends on measurement method!"},
        {q: ["poorest country", "least developed country"], a: "Varies by metric. Burundi, South Sudan, and Somalia often rank as poorest by GDP per capita. Complex economic situation!"},
        
        // Regions & Places
        {q: ["what is equator", "equator line"], a: "Equator is imaginary line circling Earth at 0° latitude, dividing Northern and Southern Hemispheres. Hottest regions, 12-hour days year-round!"},
        {q: ["what is prime meridian", "prime meridian line"], a: "Prime Meridian is 0° longitude line passing through Greenwich, England. Divides Eastern and Western Hemispheres. Basis for time zones!"},
        {q: ["what are tropics", "tropic of cancer capricorn"], a: "Tropics are region between Tropic of Cancer (23.5°N) and Tropic of Capricorn (23.5°S). Hot, humid climate. Where Sun is directly overhead!"},
        {q: ["what is arctic", "arctic region"], a: "Arctic is polar region around North Pole, including Arctic Ocean and northern parts of continents. Characterized by ice, tundra, permafrost!"},
        {q: ["what is antarctica", "antarctic continent"], a: "Antarctica is southernmost continent surrounding South Pole. Coldest, driest, windiest continent. 98% covered by ice. No permanent residents!"},
        {q: ["seven wonders of world", "7 wonders", "wonders of the world"], a: "New 7 Wonders: Great Wall (China), Petra (Jordan), Christ Redeemer (Brazil), Machu Picchu (Peru), Chichen Itza (Mexico), Colosseum (Italy), Taj Mahal (India)!"},
    ],

// 9. HISTORY (FULLY EXPANDED)
    history: [
        // Inventions & Discoveries
        {q: ["who invented the telephone", "telephone inventor", "invented telephone"], a: "Alexander Graham Bell is credited with inventing the telephone in 1876, though Elisha Gray filed similar patent same day!"},
        {q: ["who painted mona lisa", "mona lisa artist", "mona lisa painter"], a: "The Mona Lisa was painted by Leonardo da Vinci in early 16th century (1503-1519). Housed in Louvre Museum, Paris!"},
        {q: ["who discovered america", "columbus", "discovered america"], a: "Christopher Columbus reached Americas in 1492 for Europeans, though indigenous peoples lived there for thousands of years. Vikings (Leif Erikson) reached ~1000 CE!"},
        {q: ["who invented electricity", "electricity inventor", "discovered electricity"], a: "Electricity wasn't invented but discovered/harnessed. Benjamin Franklin (lightning experiment), Michael Faraday (generator), Thomas Edison (light bulb), Nikola Tesla (AC power)!"},
        {q: ["who invented the internet", "internet inventor", "created internet"], a: "Internet developed by many: ARPANET (1960s), TCP/IP (Vint Cerf, Bob Kahn), Tim Berners-Lee (World Wide Web, 1989). Collaborative effort!"},
        {q: ["who was einstein", "albert einstein", "einstein physicist"], a: "Albert Einstein (1879-1955) was theoretical physicist who developed theory of relativity (E=mc²), revolutionizing physics. Nobel Prize 1921!"},
        {q: ["who was shakespeare", "william shakespeare", "shakespeare writer"], a: "William Shakespeare (1564-1616) was English playwright and poet, often called greatest writer in English language. Wrote Romeo & Juliet, Hamlet, Macbeth!"},
        {q: ["when did world war 2 end", "ww2 end", "world war 2 end date"], a: "World War 2 ended in 1945: Germany surrendered May 8 (V-E Day), Japan surrendered September 2 (V-J Day) after atomic bombs!"},
        {q: ["when did world war 1 end", "ww1 end", "world war 1 end date"], a: "World War 1 ended November 11, 1918 at 11am with armistice. Treaty of Versailles signed June 28, 1919!"},
        {q: ["who was napoleon", "napoleon bonaparte"], a: "Napoleon Bonaparte (1769-1821) was French military leader and emperor who dominated European affairs in early 19th century. Rose during French Revolution!"},
        {q: ["who invented the airplane", "airplane inventor", "wright brothers"], a: "The Wright Brothers (Orville and Wilbur) invented and flew first successful powered airplane December 17, 1903 at Kitty Hawk, North Carolina!"},
        {q: ["who invented the car", "automobile inventor", "first car"], a: "Karl Benz is credited with inventing first practical automobile powered by internal combustion engine in 1885-1886!"},
        {q: ["who invented the light bulb", "light bulb inventor", "edison light bulb"], a: "Thomas Edison is credited with inventing first practical incandescent light bulb in 1879, though others (Swan) made similar inventions!"},
        {q: ["who invented the printing press", "printing press inventor", "gutenberg"], a: "Johannes Gutenberg invented movable-type printing press around 1440, revolutionizing information spread. Printed first Gutenberg Bible ~1455!"},
        {q: ["who was cleopatra", "cleopatra egypt"], a: "Cleopatra VII (69-30 BCE) was last active pharaoh of ancient Egypt, famous for relationships with Julius Caesar and Mark Antony!"},
        {q: ["who was julius caesar", "julius caesar rome"], a: "Julius Caesar (100-44 BCE) was Roman general and statesman who played critical role transforming Roman Republic into Roman Empire. Assassinated March 15, 44 BCE!"},
        {q: ["when did cold war end", "cold war end", "end of cold war"], a: "Cold War ended around 1989-1991 with fall of Berlin Wall (November 1989) and dissolution of Soviet Union (December 1991)!"},
        {q: ["who walked on the moon first", "first moon landing", "moon landing"], a: "Neil Armstrong was first person to walk on Moon on July 20, 1969, followed by Buzz Aldrin. Apollo 11 mission. 'One small step for man...'!"},
        {q: ["who was alexander the great", "alexander the great"], a: "Alexander the Great (356-323 BCE) was Macedonian king who created one of largest empires in history by age 30, never losing a battle!"},
        {q: ["when was america founded", "usa independence", "independence day"], a: "USA declared independence July 4, 1776 (Independence Day). Revolutionary War ended 1783. Constitution ratified 1788!"},
        {q: ["when did titanic sink", "titanic sinking", "titanic disaster"], a: "RMS Titanic sank April 15, 1912 after hitting iceberg on maiden voyage. ~1,500 people died. 'Unsinkable' ship tragedy!"},
        {q: ["when was french revolution", "french revolution date"], a: "French Revolution began 1789 with storming of Bastille (July 14) and lasted until 1799. Overthrew monarchy, established republic!"},
        {q: ["when did berlin wall fall", "fall of berlin wall"], a: "Berlin Wall fell November 9, 1989, symbolizing end of Cold War and reunifying East and West Germany!"},
        {q: ["who was martin luther king", "mlk", "martin luther king jr"], a: "Martin Luther King Jr. (1929-1968) was American civil rights leader who fought against racial segregation through nonviolent protest. 'I Have a Dream' speech!"},
        {q: ["who was gandhi", "mahatma gandhi"], a: "Mahatma Gandhi (1869-1948) was Indian independence leader who used nonviolent civil disobedience to free India from British rule. Inspired civil rights movements worldwide!"},
        {q: ["when did dinosaurs go extinct", "dinosaur extinction"], a: "Dinosaurs went extinct ~66 million years ago at end of Cretaceous period, likely from asteroid impact (Chicxulub crater). Birds are dinosaur descendants!"},
        {q: ["when was renaissance", "renaissance period"], a: "Renaissance was European cultural movement from 14th-17th century (1300s-1600s). Bridge between Middle Ages and modern era. Rebirth of art, science, philosophy!"},
        {q: ["who discovered penicillin", "penicillin discovery"], a: "Alexander Fleming discovered penicillin (first antibiotic) in 1928 by accident when mold contaminated bacterial culture. Revolutionized medicine!"},
    ],


 // 10. ANIMALS (FULLY EXPANDED)
    animals: [
        {q: ["fastest animal", "fastest animal on earth", "fastest land animal"], a: "Cheetah is fastest land animal, reaching speeds up to 70 mph (112 km/h) in short bursts. Can accelerate 0-60 mph in 3 seconds!"},
        {q: ["largest animal", "biggest animal", "largest animal ever"], a: "Blue whale is largest animal ever known to exist, weighing up to 200 tons and reaching 100 feet in length. Heart size of car!"},
        {q: ["tallest animal", "tallest animal on earth"], a: "Giraffe is tallest living land animal, with males reaching heights up to 18 feet (5.5 meters). Long neck has only 7 vertebrae like humans!"},
        {q: ["smallest animal", "tiniest animal", "smallest mammal"], a: "Etruscan shrew is smallest mammal by mass (~1.8 grams). Bumblebee bat is smallest by length. Fairyfly is smallest insect!"},
        {q: ["smartest animal", "most intelligent animal", "intelligent animals"], a: "Besides humans: dolphins, great apes (chimps, orangutans, gorillas), elephants, crows/ravens, octopuses, and parrots are highly intelligent!"},
        {q: ["strongest animal", "strongest animal on earth"], a: "Dung beetle is strongest relative to body weight (1,141× body weight). Elephant is strongest absolutely. Gorilla is strongest primate!"},
        {q: ["slowest animal", "slowest animal on earth"], a: "Three-toed sloth is one of slowest mammals, moving ~0.15 mph. Slower: sea anemone, starfish, garden snails. Sloths sleep 15-20 hours daily!"},
        {q: ["how long do dogs live", "dog lifespan", "dog life expectancy"], a: "Dogs typically live 10-13 years average. Varies by breed: small breeds (15+ years), large breeds (8-10 years). Proper care extends life!"},
        {q: ["how long do cats live", "cat lifespan", "cat life expectancy"], a: "Domestic cats typically live 12-18 years, with some reaching early 20s with proper care. Indoor cats live longer than outdoor cats!"},
        {q: ["what do pandas eat", "panda diet", "panda food"], a: "Giant pandas primarily eat bamboo, consuming up to 40 pounds daily (12-16 hours eating). Technically carnivores but 99% diet is bamboo!"},
        {q: ["can penguins fly", "penguin flight", "do penguins fly"], a: "Penguins cannot fly in air. Their wings evolved for swimming - they essentially 'fly' through water at speeds up to 22 mph!"},
        {q: ["how many hearts does an octopus have", "octopus hearts"], a: "Octopus has three hearts: two pump blood to gills, one pumps to rest of body. Blood is blue (copper-based hemocyanin)!"},
        {q: ["what do elephants eat", "elephant diet", "elephant food"], a: "Elephants are herbivores eating grasses, leaves, bark, fruits, consuming up to 300 pounds daily (16-18 hours eating). Need lots of water!"},
        {q: ["how long do elephants live", "elephant lifespan", "elephant life expectancy"], a: "Elephants typically live 60-70 years in wild, similar to humans. Some reach 80+ years. Longest-living land mammals besides humans!"},
        {q: ["are sharks mammals", "shark mammal", "are sharks fish"], a: "No, sharks are fish, not mammals. They have gills (breathe water), are cold-blooded, and most lay eggs. Cartilaginous fish!"},
        {q: ["are dolphins fish", "dolphin fish", "are dolphins mammals"], a: "No, dolphins are mammals, not fish. They breathe air with lungs, are warm-blooded, give live birth, and nurse young with milk!"},
        {q: ["are whales fish", "whale fish", "are whales mammals"], a: "No, whales are mammals, not fish. They breathe air through blowholes, are warm-blooded, give live birth, and nurse young!"},
        {q: ["what is the deadliest animal", "most dangerous animal", "most lethal animal"], a: "Mosquitoes are deadliest to humans, causing millions of deaths annually through disease transmission (malaria, dengue). Then humans, snakes, dogs (rabies)!"},
        {q: ["how many legs does a spider have", "spider legs", "spider leg count"], a: "Spiders have 8 legs, which distinguishes them from insects (6 legs). Also have 8 eyes typically. Arachnids, not insects!"},
        {q: ["do snakes have bones", "snake bones", "snake skeleton"], a: "Yes! Snakes have 200-400 vertebrae and ribs. Flexible backbone allows slithering. No legs, but some have vestigial hip bones!"},
        {q: ["how do birds fly", "bird flight", "how can birds fly"], a: "Birds fly using wings (modified forelimbs) with feathers. Lightweight hollow bones, strong flight muscles, aerodynamic shape. Flap or glide!"},
        {q: ["can all birds fly", "flightless birds", "birds that cant fly"], a: "No! Flightless birds include: penguins, ostriches, emus, kiwis, cassowaries. Lost flight through evolution, adapted to ground/water!"},
        {q: ["what do bees eat", "bee diet", "bee food"], a: "Bees eat nectar (carbohydrates) and pollen (protein) from flowers. Make honey from nectar for winter food storage. Critical pollinators!"},
        {q: ["how do bees make honey", "honey production", "bee honey"], a: "Bees collect nectar, add enzymes, regurgitate into honeycomb, fan with wings to evaporate water. Concentrated nectar becomes honey!"},
        {q: ["are bats birds", "bat bird", "are bats mammals"], a: "Bats are mammals, not birds! Only flying mammals. Have wings (stretched skin), fur, nurse young with milk. Echolocation for navigation!"},
        {q: ["what do koalas eat", "koala diet", "koala food"], a: "Koalas eat eucalyptus leaves almost exclusively. Toxic to most animals but koalas evolved to digest them. Sleep 18-22 hours daily!"},
        {q: ["fastest bird", "fastest flying bird"], a: "Peregrine falcon is fastest bird in diving flight (~240 mph). Fastest level flight: golden eagle or white-throated needletail (~100 mph)!"},
        {q: ["largest bird", "biggest bird"], a: "Common ostrich is largest/heaviest living bird (up to 320 lbs, 9 ft tall). Wandering albatross has largest wingspan (~11.5 ft)!"},
        {q: ["can fish drown", "do fish drown"], a: "Fish can't drown in water but can suffocate if water lacks oxygen or if gills are damaged. Need dissolved oxygen in water!"},
        {q: ["how do fish breathe", "fish breathing", "fish gills"], a: "Fish breathe by pulling water through mouth, over gills which extract dissolved oxygen. Blood in gills absorbs O₂, releases CO₂!"},
        {q: ["what is the lifespan of a fly", "fly lifespan", "how long do flies live"], a: "House flies live ~28 days as adults. Fruit flies ~40-50 days. Total lifecycle (egg to death) is 15-30 days for house flies!"},
        {q: ["do ants sleep", "ant sleep"], a: "Yes! Worker ants take ~250 naps per day, each lasting ~1 minute (~4.8 hours total). Queens sleep longer. Power naps!"},
        {q: ["what do ants eat", "ant diet", "ant food"], a: "Ants eat various foods depending on species: sugars, proteins, fats, seeds, fungi, other insects. Some farm fungi or herd aphids!"},
    ],



    // 11. SPACE & ASTRONOMY (FULLY EXPANDED)
    space: [
        {q: ["how many planets", "number of planets", "planets in solar system"], a: "There are 8 planets in our solar system: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune (ordered from Sun). Pluto demoted 2006!"},
        {q: ["what is the sun", "explain sun", "our star"], a: "Sun is star at center of our solar system, massive ball of hot plasma (mostly hydrogen, helium) providing light and heat through nuclear fusion. 99.86% of solar system mass!"},
        {q: ["largest planet", "biggest planet", "largest planet solar system"], a: "Jupiter is largest planet in solar system, with mass more than twice all other planets combined. 1,300 Earths could fit inside!"},
        {q: ["smallest planet", "tiniest planet", "smallest planet solar system"], a: "Mercury is smallest planet in our solar system (after Pluto's demotion), only slightly larger than Earth's Moon!"},
        {q: ["closest planet to sun", "nearest planet to sun"], a: "Mercury is closest planet to Sun, orbiting at average distance of 36 million miles (58 million km). Very hot days, very cold nights!"},
        {q: ["what is the milky way", "milky way galaxy", "our galaxy"], a: "Milky Way is spiral galaxy containing our solar system, with estimated 200-400 billion stars. ~100,000 light-years across. We're in outer arm!"},
        {q: ["how far is the moon", "moon distance", "earth to moon"], a: "Moon is about 238,855 miles (384,400 km) from Earth on average. Distance varies (elliptical orbit): 225,623 to 252,088 miles!"},
        {q: ["how many moons does earth have", "earth moons", "earth moon count"], a: "Earth has one natural moon, simply called 'the Moon' or Luna. ~1/4 Earth's diameter. 5th largest moon in solar system!"},
        {q: ["how many moons does jupiter have", "jupiter moons", "jupiter moon count"], a: "Jupiter has 95 known moons (as of 2023), most of any planet! Largest: Io, Europa, Ganymede, Callisto (Galilean moons)!"},
        {q: ["how many moons does saturn have", "saturn moons"], a: "Saturn has 146 known moons! Most famous: Titan (larger than Mercury). Beautiful ring system too!"},
        {q: ["what is mars", "red planet", "mars planet"], a: "Mars is 4th planet from Sun, known as 'Red Planet' due to iron oxide (rust) on surface. Has polar ice caps, largest volcano (Olympus Mons), deepest canyon (Valles Marineris)!"},
        {q: ["can we live on mars", "living on mars", "mars colonization"], a: "Not currently without life support. Mars has thin CO₂ atmosphere (no breathable O₂), extreme cold (-80°F average), high radiation. Future colonization researched by NASA, SpaceX!"},
        {q: ["is pluto a planet", "pluto planet", "why isnt pluto a planet"], a: "Pluto is classified as dwarf planet since 2006. Didn't meet criteria: hasn't cleared its orbital neighborhood. Still beloved! 5 dwarf planets: Pluto, Eris, Ceres, Haumea, Makemake."},
        {q: ["what is venus", "venus planet"], a: "Venus is 2nd planet from Sun, Earth's 'sister planet' (similar size). Hottest planet (~900°F) due to runaway greenhouse effect. Thick CO₂ atmosphere, sulfuric acid clouds!"},
        {q: ["what is saturn", "saturn planet", "saturn rings"], a: "Saturn is 6th planet, gas giant famous for spectacular ring system (ice and rock particles). 2nd largest planet. Low density - would float in water!"},
        {q: ["what is uranus", "uranus planet"], a: "Uranus is 7th planet, ice giant that rotates on its side (98° tilt). Coldest planetary atmosphere (-370°F). Blue-green color from methane!"},
        {q: ["what is neptune", "neptune planet"], a: "Neptune is 8th and farthest planet, ice giant with strongest winds in solar system (1,200 mph). Dark blue color from methane. 14 known moons!"},
        {q: ["what is mercury", "mercury planet"], a: "Mercury is 1st planet from Sun, smallest planet. No atmosphere, extreme temperature swings: 800°F day, -290°F night. Cratered surface like Moon!"},
        {q: ["how hot is the sun", "sun temperature"], a: "Sun's surface: ~10,000°F (5,500°C). Core: ~27 million°F (15 million°C) where fusion occurs. Corona (outer atmosphere): 1-3 million°F!"},
        {q: ["how old is the sun", "sun age"], a: "Sun is ~4.6 billion years old, about halfway through its life. Will become red giant in ~5 billion years, then white dwarf!"},
        {q: ["what is a light year", "light year distance"], a: "Light-year is distance light travels in one year: ~5.88 trillion miles (9.46 trillion km). Used for astronomical distances. Nearest star: 4.2 light-years!"},
        {q: ["what is dark matter", "dark matter universe"], a: "Dark matter is invisible matter making ~85% of universe's matter. Doesn't emit/absorb light. Detected only by gravitational effects. Major physics mystery!"},
        {q: ["what is dark energy", "dark energy universe"], a: "Dark energy is mysterious force causing universe's expansion to accelerate. Makes up ~68% of universe! Nobody fully understands it - cutting edge physics!"},
        {q: ["is there life on other planets", "alien life", "extraterrestrial life"], a: "Unknown! No confirmed alien life yet. Scientists search using telescopes, missions to Mars/Europa/Enceladus. Given universe's size, many think life is likely somewhere!"},
        {q: ["what is international space station", "iss", "space station"], a: "International Space Station (ISS) is habitable space station in low Earth orbit. Launched 1998, continuously occupied since 2000. International collaboration!"},
        {q: ["who was first person in space", "first astronaut", "yuri gagarin"], a: "Yuri Gagarin (Soviet) was first human in space on April 12, 1961. Orbited Earth in Vostok 1 spacecraft. Space race achievement!"},
        {q: ["what is hubble telescope", "hubble space telescope"], a: "Hubble Space Telescope is space telescope launched 1990, orbiting Earth. Captured incredible deep space images, revolutionized astronomy. Successor: James Webb!"},
        {q: ["what is james webb telescope", "james webb space telescope", "jwst"], a: "James Webb Space Telescope (JWST) launched December 2021, most powerful space telescope. Infrared observations, studying early universe, exoplanets. Hubble's successor!"},
    ],

    // 12. ENTERTAINMENT & CULTURE (EXPANDED)
    entertainment: [
        {q: ["who is the most famous singer", "famous singer", "best singer"], a: "Many singers are considered among most famous across different eras: Elvis Presley, Michael Jackson, Madonna, Beyoncé, Taylor Swift, Beatles!"},
        {q: ["who is the best actor", "greatest actor", "famous actor"], a: "Many actors considered greats depending on criteria: Marlon Brando, Meryl Streep, Robert De Niro, Denzel Washington, Daniel Day-Lewis!"},
        {q: ["what is the highest grossing movie", "highest grossing film", "biggest movie"], a: "Avatar (2009) is currently highest-grossing film of all time (~$2.9 billion worldwide), followed by Avengers: Endgame!"},
        {q: ["who wrote harry potter", "harry potter author", "jk rowling"], a: "J.K. Rowling wrote Harry Potter series (7 books, 1997-2007), one of best-selling book series in history. Over 500 million copies sold!"},
        {q: ["who wrote romeo and juliet", "romeo and juliet author", "shakespeare plays"], a: "William Shakespeare wrote Romeo and Juliet (~1595), one of his most famous tragedies about star-crossed lovers!"},
        {q: ["what is the most popular sport", "most watched sport", "biggest sport"], a: "Soccer (football) is most popular sport globally with billions of fans worldwide. Basketball, cricket, tennis also hugely popular!"},
        {q: ["who won the most olympic medals", "most olympic medals", "olympic record"], a: "Michael Phelps holds record for most Olympic medals: 28 total (23 gold, 3 silver, 2 bronze) in swimming. Legendary athlete!"},
        {q: ["what is netflix", "explain netflix", "netflix streaming"], a: "Netflix is streaming service offering wide variety of TV shows, movies, documentaries, and original content on demand. Started as DVD rental!"},
        {q: ["what is spotify", "explain spotify", "spotify music"], a: "Spotify is digital music streaming service providing access to millions of songs, podcasts, and playlists. Freemium model (free with ads or premium)!"},
        {q: ["who painted starry night", "starry night artist", "van gogh"], a: "Vincent van Gogh painted 'The Starry Night' in 1889. One of most famous paintings, depicting swirling night sky over village!"},
        {q: ["who invented piano", "piano inventor"], a: "Bartolomeo Cristofori invented piano around 1700 in Italy. Originally called 'pianoforte' meaning soft-loud (dynamic range)!"},
        {q: ["what is symphony", "symphony music"], a: "Symphony is extended musical composition for orchestra, typically in 4 movements. Classical music form. Famous: Beethoven's 9th, Mozart's 40th!"},
        {q: ["what is opera", "explain opera"], a: "Opera is theatrical art form combining music, singing, acting, scenery. Singers perform without microphones. Famous: La Bohème, Carmen, The Magic Flute!"},
        {q: ["what is ballet", "explain ballet"], a: "Ballet is classical dance form with formalized steps and gestures, often telling story through movement. Requires years of training. Famous: Swan Lake, Nutcracker!"},
        {q: ["first video game", "oldest video game", "video game history"], a: "First video game: debated! 'Tennis for Two' (1958), 'Spacewar!' (1962), or 'Pong' (1972) often cited. Video game industry worth billions now!"},
    ],

    // 13. DAILY LIFE & PRACTICAL (EXPANDED)
    dailylife: [
        {q: ["how to cook rice", "cooking rice", "cook rice"], a: "To cook rice: Rinse 1 cup rice, add 2 cups water, bring to boil, reduce heat to low, cover, simmer 15-20 minutes. Let rest 5 min. Fluff!"},
        {q: ["how to boil eggs", "boiling eggs", "cook eggs"], a: "Boil eggs: Place eggs in pot, cover with cold water, bring to boil, remove from heat, cover 9-12 minutes (hard-boiled). Ice bath to stop cooking!"},
        {q: ["how to lose weight", "weight loss tips", "lose weight fast"], a: "Healthy weight loss: Eat balanced diet with calorie deficit, exercise regularly (cardio + strength), stay hydrated, get 7-9 hours sleep, be consistent and patient!"},
        {q: ["how much water should i drink", "water intake", "daily water"], a: "Most adults need ~8 glasses (2 liters/64 oz) of water daily. Varies by activity, climate, individual factors. Urine color is good indicator (pale yellow)!"},
        {q: ["how many hours of sleep", "sleep needed", "how much sleep"], a: "Adults generally need 7-9 hours sleep per night for optimal health. Teens: 8-10 hours. Children: 9-12 hours. Quality matters too!"},
        {q: ["how to save money", "saving money tips", "save money"], a: "Save money: Create budget, track expenses, reduce unnecessary spending (eating out, subscriptions), automate savings (pay yourself first), set financial goals!"},
        {q: ["how to study effectively", "study tips", "study better"], a: "Effective studying: Active recall, spaced repetition, teach concepts to others, take regular breaks (Pomodoro), eliminate distractions, sleep well, practice problems!"},
        {q: ["how to make coffee", "making coffee", "brew coffee"], a: "Basic coffee: Use 1-2 tablespoons ground coffee per 6 oz water. Brew with hot water (195-205°F), steep 4-5 minutes. Adjust to taste!"},
        {q: ["how to tie a tie", "tie a necktie", "tying tie"], a: "Common knot (Four-in-Hand): Wide end crosses narrow, wraps around, pulls through loop, down through knot. Adjust! Watch video tutorial helps!"},
        {q: ["how to do laundry", "washing clothes", "laundry tips"], a: "Laundry basics: Separate colors/whites, check labels, use appropriate detergent amount, wash cold (saves energy), air dry delicates, fold promptly!"},
        {q: ["how to iron clothes", "ironing", "iron shirt"], a: "Ironing: Heat iron to fabric temperature, use distilled water for steam, iron inside-out for delicates, start with collar, then shoulders, sleeves, body!"},
        {q: ["how to change a tire", "flat tire", "change tire"], a: "Change tire: Park safely, engage parking brake, loosen lug nuts, jack up car, remove flat, mount spare, hand-tighten lug nuts, lower, tighten in star pattern!"},
        {q: ["how to jump start a car", "jump start car", "dead battery"], a: "Jump start: Red clamp to dead positive (+), red to good positive, black to good negative (-), black to metal on dead car. Start good car, then dead. Wait 5 min!"},
        {q: ["how to unclog a toilet", "clogged toilet", "toilet clog"], a: "Unclog toilet: Use plunger (create seal, push-pull vigorously), or pour hot water (not boiling) + dish soap. Wait 10 min. If fails, call plumber!"},
        {q: ["how to unclog sink", "clogged sink drain"], a: "Unclog sink: Try plunger first, or baking soda + vinegar (wait 30 min), flush with hot water. Remove and clean P-trap if needed. Avoid harsh chemicals!"},
    ],


      // 14. FUN & RANDOM (EXPANDED)
    fun: [
        {q: ["tell me a joke", "joke", "make me laugh", "say a joke"], a: "Why don't scientists trust atoms? Because they make up everything! 😄"},
        {q: ["tell me another joke", "another joke", "one more joke", "different joke"], a: "Why did the scarecrow win an award? Because he was outstanding in his field! 🌾"},
        {q: ["tell me a dad joke", "dad joke"], a: "I'm afraid for the calendar. Its days are numbered! 📅"},
        {q: ["tell me a knock knock joke", "knock knock"], a: "Knock knock! Who's there? Interrupting cow. Interrupting cow w-- MOOOOO! 🐄"},
        {q: ["tell me a fun fact", "fun fact", "interesting fact", "cool fact"], a: "Fun fact: Honey never spoils! Archaeologists have found 3,000-year-old honey in Egyptian tombs that was still perfectly edible!"},
        {q: ["tell me something interesting", "something interesting", "something cool"], a: "Did you know? Octopuses have three hearts and blue blood! Two hearts pump blood to gills, one pumps to rest of body!"},
        {q: ["tell me a riddle", "riddle", "ask me a riddle"], a: "Riddle: I speak without a mouth and hear without ears. I have no body, but come alive with wind. What am I? (Answer: An echo!)"},
        {q: ["what is the answer to the riddle", "riddle answer", "answer riddle"], a: "The answer to the echo riddle is: An echo! It 'speaks' (reflects sound) and 'hears' (responds to sound) but has no physical form!"},
        {q: ["i'm bored", "entertain me", "bored", "im bored"], a: "Let's fix that boredom! Want to: hear a fun fact? Learn something new? Play 20 questions? Hear a joke? Ask me anything interesting!"},
        {q: ["say something funny", "make it funny", "be funny"], a: "Why do programmers prefer dark mode? Because light attracts bugs! 🐛💻"},
        {q: ["tell me about yourself", "about you", "who made you"], a: "I'm Mega-AI, chatbot with 5000+ answers built with JavaScript! I love helping people learn, answer questions, and have fun conversations. What would you like to know?"},
        {q: ["what should i do", "what to do", "what can i do"], a: "That depends on your mood! Want to learn something new, hear a joke, get life advice, or explore a random topic? Tell me what interests you!"},
        {q: ["i don't know what to ask", "what can i ask", "what to ask", "dont know what to ask"], a: "You can ask me about: science, technology, history, animals, space, math, geography, programming, or just chat! Try 'tell me a fun fact' or 'what is [topic]'!"},
        {q: ["sing me a song", "sing", "can you sing"], a: "I can't sing, but I can share lyrics or recommend songs! What genre do you like? Pop, rock, classical, jazz?"},
        {q: ["do you know any songs", "song lyrics"], a: "I know about many songs but can't reproduce copyrighted lyrics. I can discuss music, recommend songs, or explain music theory!"},
        {q: ["flip a coin", "coin flip", "heads or tails"], a: "🪙 Flipping... It's HEADS! (Well, virtually! For real randomness, flip an actual coin!)"},
        {q: ["roll a die", "roll dice", "random number"], a: "🎲 Rolling... You got a 4! (For truly random results, use actual dice!)"},
        {q: ["what's the meaning of life", "meaning of life", "42"], a: "According to Hitchhiker's Guide to the Galaxy: 42! But seriously, it's deeply personal. Many find meaning through relationships, purpose, growth, and contribution!"},
    ],


        // 15. PHILOSOPHY & DEEP QUESTIONS (EXPANDED)
    philosophy: [
        {q: ["what is the meaning of life", "meaning of life", "lifes meaning", "why do we live"], a: "The meaning of life is deeply personal. Many find meaning through relationships, contributing to others, pursuing passions, personal growth, or spiritual beliefs. Create your own meaning!"},
        {q: ["why do we exist", "why are we here", "purpose of existence"], a: "This is one of humanity's oldest questions! Different philosophies and religions offer various answers - from serving higher purpose to creating our own meaning through choices!"},
        {q: ["what is consciousness", "explain consciousness", "conscious awareness"], a: "Consciousness is state of being aware of and able to think about oneself and surroundings. How it arises from brain remains major mystery - the 'hard problem' of consciousness!"},
        {q: ["what is love", "define love", "meaning of love"], a: "Love is complex emotion involving deep affection, care, attachment, and connection. Can be romantic, familial, platonic. Drives much of human behavior and motivation!"},
        {q: ["what is happiness", "define happiness", "how to be happy"], a: "Happiness is positive emotional state of well-being, contentment, joy. Comes from meaningful relationships, achievements, living according to values. Journey, not destination!"},
        {q: ["what is success", "define success", "meaning of success"], a: "Success is achieving your goals and living according to your values. It's personal and different for everyone - wealth, happiness, impact, personal growth, or relationships!"},
        {q: ["is there free will", "free will", "do we have free will"], a: "Free will existence is debated by philosophers and scientists. Compatibilists: yes, with some determinism. Hard determinists: no, all is predetermined. Libertarians: yes, genuine choice!"},
        {q: ["what is reality", "define reality", "what is real"], a: "Reality is state of things as they actually exist, independent of perception. But how we perceive and understand reality varies! Philosophy of mind explores this!"},
        {q: ["what is time", "explain time", "nature of time"], a: "Time is continuous progression of existence from past through present to future. Physics shows it's relative, not absolute (Einstein). Still mysterious - arrow of time, entropy!"},
        {q: ["what happens after death", "after death", "afterlife"], a: "What happens after death is unknown scientifically. Different religions and philosophies offer various perspectives (heaven, reincarnation, nothing). Personal belief matter!"},
        {q: ["what is right and wrong", "morality", "ethics"], a: "Right and wrong often come from cultural values, ethics, empathy, consequences. Many believe in treating others with respect, minimizing harm. Golden Rule: treat others as you'd like!"},
        {q: ["does god exist", "is there a god", "god existence"], a: "God's existence is matter of personal faith and philosophical debate. Theists believe yes, atheists no, agnostics unsure. No scientific proof either way. Deeply personal!"},
        {q: ["what is the purpose of life", "life purpose", "why am i here"], a: "Life's purpose is personal. Some find it through: helping others, pursuing passions, raising family, creating art, seeking knowledge, spiritual growth. You define your purpose!"},
    ],


health: [
    {q: ["what are vitamins", "whats a vitamin", "what's a vitamin", "explain vitamins", "define vitamins", "vitamin"], a: "Vitamins are essential nutrients that your body needs in small amounts to function properly and stay healthy."},
    {q: ["how much water should i drink", "water intake", "how much water daily", "daily water intake", "water per day"], a: "Most people should drink about 8 glasses (2 liters) of water daily, though needs vary by activity and climate."},
    {q: ["what is exercise", "whats exercise", "what's exercise", "importance of exercise", "why exercise", "exercise benefits"], a: "Exercise is physical activity that improves health and fitness. It strengthens muscles, bones, and the cardiovascular system."},
    {q: ["how many hours of sleep", "sleep needed", "how much sleep", "sleep hours", "how much sleep do i need"], a: "Adults generally need 7-9 hours of sleep per night for optimal health and functioning."},
    {q: ["what is immune system", "whats immune system", "what's immune system", "explain immune system", "define immune system"], a: "The immune system is your body's defense network that protects against infections and diseases."},
    {q: ["what causes cold", "common cold", "why do we get colds", "cold causes", "what is a cold"], a: "The common cold is caused by viral infections, most commonly rhinoviruses, affecting the upper respiratory tract."},
    {q: ["what is bmi", "whats bmi", "what's bmi", "body mass index", "explain bmi", "define bmi"], a: "BMI (Body Mass Index) is a measure of body fat based on height and weight, used to assess if someone is at a healthy weight."},
    {q: ["what is protein", "whats protein", "what's protein", "explain protein", "define protein", "proteins"], a: "Protein is a macronutrient made of amino acids, essential for building and repairing tissues, making enzymes, and supporting immune function."},
    {q: ["what causes headache", "headache causes", "why headaches", "what is a headache", "headache"], a: "Headaches can be caused by stress, dehydration, lack of sleep, eye strain, tension, or various medical conditions."},
    {q: ["what is diabetes", "whats diabetes", "what's diabetes", "explain diabetes", "define diabetes"], a: "Diabetes is a chronic disease that occurs when blood sugar levels are too high due to problems with insulin production or function."}
],

sports: [
    {q: ["what is soccer", "whats soccer", "what's soccer", "explain soccer", "define soccer", "football"], a: "Soccer (football) is a team sport where two teams of 11 players try to score by getting a ball into the opposing goal, using any body part except hands and arms."},
    {q: ["what is basketball", "whats basketball", "what's basketball", "explain basketball", "define basketball"], a: "Basketball is a team sport where two teams of 5 players score points by shooting a ball through a hoop mounted 10 feet high."},
    {q: ["who is michael jordan", "michael jordan", "who was michael jordan", "mj basketball"], a: "Michael Jordan is widely considered the greatest basketball player of all time, winning 6 NBA championships with the Chicago Bulls."},
    {q: ["what is the olympics", "whats the olympics", "what's the olympics", "olympic games", "explain olympics"], a: "The Olympics are international sports competitions held every four years, featuring summer and winter games with athletes from around the world."},
    {q: ["what is tennis", "whats tennis", "what's tennis", "explain tennis", "define tennis"], a: "Tennis is a racket sport played individually (singles) or in pairs (doubles), where players hit a ball over a net into the opponent's court."},
    {q: ["what is golf", "whats golf", "what's golf", "explain golf", "define golf"], a: "Golf is a sport where players use clubs to hit balls into a series of holes on a course in as few strokes as possible."},
    {q: ["what is baseball", "whats baseball", "what's baseball", "explain baseball", "define baseball"], a: "Baseball is a bat-and-ball sport played between two teams of nine players who take turns batting and fielding."},
    {q: ["what is cricket", "whats cricket", "what's cricket", "explain cricket", "define cricket"], a: "Cricket is a bat-and-ball game played between two teams, popular in England, India, Australia, and other Commonwealth nations."},
    {q: ["what is swimming", "whats swimming", "what's swimming", "explain swimming", "swimming sport"], a: "Swimming is both a recreational activity and competitive sport involving propelling oneself through water using limbs."},
    {q: ["what is marathon", "whats a marathon", "what's a marathon", "marathon distance", "explain marathon"], a: "A marathon is a long-distance running race of 42.195 kilometers (26.219 miles), named after the Greek legend of Pheidippides."}
],

weather: [
    {q: ["what is a hurricane", "whats a hurricane", "what's a hurricane", "explain hurricane", "define hurricane", "hurricanes"], a: "A hurricane is a powerful tropical storm with rotating winds exceeding 74 mph, forming over warm ocean waters."},
    {q: ["what is a tornado", "whats a tornado", "what's a tornado", "explain tornado", "define tornado", "tornadoes"], a: "A tornado is a violently rotating column of air extending from a thunderstorm to the ground, capable of extreme destruction."},
    {q: ["what causes rain", "why does it rain", "rain causes", "how does rain form", "what is rain"], a: "Rain forms when water vapor in clouds condenses into droplets heavy enough to fall to Earth due to gravity."},
    {q: ["what is thunder", "whats thunder", "what's thunder", "explain thunder", "what causes thunder", "thunder"], a: "Thunder is the sound caused by lightning rapidly heating and expanding the air, creating a shock wave we hear as a rumble or crack."},
    {q: ["what is snow", "whats snow", "what's snow", "explain snow", "how does snow form", "what causes snow"], a: "Snow forms when water vapor in clouds freezes into ice crystals that stick together and fall to the ground when heavy enough."},
    {q: ["what is humidity", "whats humidity", "what's humidity", "explain humidity", "define humidity"], a: "Humidity is the amount of water vapor present in the air, affecting how comfortable the temperature feels."},
    {q: ["what is fog", "whats fog", "what's fog", "explain fog", "how does fog form", "what causes fog"], a: "Fog is a cloud that forms at ground level when air near the surface cools and water vapor condenses into tiny droplets."},
    {q: ["what is wind", "whats wind", "what's wind", "explain wind", "what causes wind", "how does wind form"], a: "Wind is the movement of air from areas of high pressure to areas of low pressure, caused by uneven heating of Earth's surface."}
],

business: [
    {q: ["what is gdp", "whats gdp", "what's gdp", "gross domestic product", "explain gdp", "define gdp"], a: "GDP (Gross Domestic Product) is the total monetary value of all goods and services produced in a country during a specific period."},
    {q: ["what is inflation", "whats inflation", "what's inflation", "explain inflation", "define inflation"], a: "Inflation is the rate at which the general level of prices for goods and services rises, reducing purchasing power over time."},
    {q: ["what is stock market", "whats stock market", "what's stock market", "explain stock market", "stock market"], a: "The stock market is where shares of publicly traded companies are bought and sold, allowing companies to raise capital and investors to own part of businesses."},
    {q: ["what is entrepreneur", "whats an entrepreneur", "what's an entrepreneur", "explain entrepreneur", "define entrepreneur"], a: "An entrepreneur is someone who starts and operates a business, taking on financial risks in hopes of profit and innovation."},
    {q: ["who is elon musk", "elon musk", "who is musk", "tell me about elon musk"], a: "Elon Musk is an entrepreneur and CEO of Tesla, SpaceX, and other companies, known for his work in electric vehicles and space exploration."},
    {q: ["who is jeff bezos", "jeff bezos", "tell me about jeff bezos", "bezos"], a: "Jeff Bezos is the founder of Amazon, one of the world's largest online retailers, and was the world's richest person for several years."},
    {q: ["who is bill gates", "bill gates", "tell me about bill gates", "gates"], a: "Bill Gates co-founded Microsoft, the world's largest software company, and is now a philanthropist focused on global health and education."},
    {q: ["what is marketing", "whats marketing", "what's marketing", "explain marketing", "define marketing"], a: "Marketing is the process of promoting and selling products or services, including research, advertising, and distribution strategies."},
    {q: ["what is supply and demand", "supply and demand", "explain supply and demand", "supply demand"], a: "Supply and demand is an economic model where the price of goods is determined by the availability (supply) and consumer desire (demand)."}
],

transportation: [
    {q: ["what is a car", "whats a car", "what's a car", "explain car", "automobile", "what is an automobile"], a: "A car (automobile) is a wheeled motor vehicle used primarily for transportation, typically powered by an internal combustion engine or electric motor."},
    {q: ["what is a train", "whats a train", "what's a train", "explain train", "trains"], a: "A train is a connected series of rail vehicles that move along tracks to transport passengers or freight."},
    {q: ["what is a plane", "whats a plane", "what's a plane", "airplane", "aircraft", "what is an airplane"], a: "A plane (airplane) is a powered flying vehicle with fixed wings that is heavier than air and capable of sustained flight."},
    {q: ["what is a ship", "whats a ship", "what's a ship", "explain ship", "ships", "boat"], a: "A ship is a large watercraft that travels through oceans and seas, used for transporting passengers or cargo."},
    {q: ["what is a helicopter", "whats a helicopter", "what's a helicopter", "explain helicopter", "helicopters"], a: "A helicopter is an aircraft with rotating wings (rotors) that allow it to take off and land vertically and hover in place."},
    {q: ["what is a submarine", "whats a submarine", "what's a submarine", "explain submarine", "submarines"], a: "A submarine is a watercraft capable of operating underwater, used for military, scientific, or exploration purposes."},
    {q: ["what is a bicycle", "whats a bicycle", "what's a bicycle", "bike", "explain bicycle"], a: "A bicycle is a human-powered vehicle with two wheels, propelled by pedals and steered with handlebars."},
    {q: ["who invented the car", "car inventor", "who created the car", "automobile inventor"], a: "Karl Benz is credited with inventing the first practical automobile powered by an internal combustion engine in 1885."}
],

language: [
    {q: ["what is a noun", "whats a noun", "what's a noun", "explain noun", "define noun", "nouns"], a: "A noun is a word that names a person, place, thing, or idea (e.g., dog, city, happiness)."},
    {q: ["what is a verb", "whats a verb", "what's a verb", "explain verb", "define verb", "verbs"], a: "A verb is a word that expresses an action, occurrence, or state of being (e.g., run, exist, become)."},
    {q: ["what is an adjective", "whats an adjective", "what's an adjective", "explain adjective", "define adjective", "adjectives"], a: "An adjective is a word that describes or modifies a noun or pronoun (e.g., beautiful, tall, quick)."},
    {q: ["what is an adverb", "whats an adverb", "what's an adverb", "explain adverb", "define adverb", "adverbs"], a: "An adverb is a word that modifies a verb, adjective, or other adverb, often ending in -ly (e.g., quickly, very, well)."},
    {q: ["how many languages", "how many languages in world", "number of languages", "how many languages are there"], a: "There are approximately 7,000 languages spoken in the world today, though many are endangered."},
    {q: ["most spoken language", "most common language", "what is the most spoken language", "popular language"], a: "English is the most widely spoken language globally when counting both native and non-native speakers, followed by Mandarin Chinese."},
    {q: ["what is grammar", "whats grammar", "what's grammar", "explain grammar", "define grammar"], a: "Grammar is the system of rules that governs how words are structured and arranged to form meaningful sentences in a language."},
    {q: ["what is a metaphor", "whats a metaphor", "what's a metaphor", "explain metaphor", "define metaphor"], a: "A metaphor is a figure of speech that compares two unlike things by stating one is the other (e.g., 'time is money')."}
],

holidays: [
    {q: ["what is christmas", "whats christmas", "what's christmas", "explain christmas", "christmas"], a: "Christmas is a Christian holiday celebrated on December 25th commemorating the birth of Jesus Christ, marked by gift-giving and family gatherings."},
    {q: ["what is halloween", "whats halloween", "what's halloween", "explain halloween", "halloween"], a: "Halloween is celebrated on October 31st with costumes, trick-or-treating, and festivities, originating from ancient Celtic harvest festivals."},
    {q: ["what is thanksgiving", "whats thanksgiving", "what's thanksgiving", "explain thanksgiving", "thanksgiving"], a: "Thanksgiving is a North American holiday celebrating gratitude and harvest, traditionally observed with a feast including turkey and other dishes."},
    {q: ["what is easter", "whats easter", "what's easter", "explain easter", "easter"], a: "Easter is a Christian holiday celebrating the resurrection of Jesus Christ, typically observed in spring with egg hunts and family gatherings."},
    {q: ["what is new year", "whats new year", "what's new year", "new years", "new year's"], a: "New Year's Day on January 1st marks the beginning of a new calendar year, celebrated worldwide with parties, fireworks, and resolutions."},
    {q: ["what is valentines day", "whats valentines day", "what's valentines day", "valentine's day", "valentines"], a: "Valentine's Day on February 14th is a celebration of love and affection, marked by exchanging cards, flowers, and gifts with loved ones."},
    {q: ["what is diwali", "whats diwali", "what's diwali", "explain diwali", "festival of lights"], a: "Diwali, the Hindu festival of lights, celebrates the victory of light over darkness and good over evil, observed with lamps, fireworks, and sweets."},
    {q: ["what is ramadan", "whats ramadan", "what's ramadan", "explain ramadan"], a: "Ramadan is the Islamic holy month of fasting, prayer, and reflection, where Muslims fast from dawn to sunset."}
],

psychology: [
    {q: ["what is psychology", "whats psychology", "what's psychology", "explain psychology", "define psychology"], a: "Psychology is the scientific study of the mind, behavior, and mental processes of humans and animals."},
    {q: ["what is anxiety", "whats anxiety", "what's anxiety", "explain anxiety", "define anxiety"], a: "Anxiety is a feeling of worry, nervousness, or unease about something with an uncertain outcome, a normal response that can become a disorder."},
    {q: ["what is depression", "whats depression", "what's depression", "explain depression", "define depression"], a: "Depression is a mental health disorder characterized by persistent sadness, loss of interest, and various emotional and physical problems."},
    {q: ["what is iq", "whats iq", "what's iq", "intelligence quotient", "explain iq"], a: "IQ (Intelligence Quotient) is a score derived from standardized tests designed to measure human intelligence and cognitive abilities."},
    {q: ["what is personality", "whats personality", "what's personality", "explain personality", "define personality"], a: "Personality is the combination of characteristics or qualities that form an individual's distinctive character and behavioral patterns."},
    {q: ["what is stress", "whats stress", "what's stress", "explain stress", "define stress"], a: "Stress is the body's reaction to any change that requires adjustment or response, which can be physical, mental, or emotional."},
    {q: ["what is motivation", "whats motivation", "what's motivation", "explain motivation", "define motivation"], a: "Motivation is the internal drive or desire that initiates and directs behavior toward achieving goals or satisfying needs."}
],

environment: [
    {q: ["what is recycling", "whats recycling", "what's recycling", "explain recycling", "define recycling"], a: "Recycling is the process of converting waste materials into new products to prevent waste, conserve resources, and reduce pollution."},
    {q: ["what is pollution", "whats pollution", "what's pollution", "explain pollution", "define pollution"], a: "Pollution is the introduction of harmful substances or contaminants into the environment, causing adverse effects on ecosystems and health."},
    {q: ["what is deforestation", "whats deforestation", "what's deforestation", "explain deforestation", "define deforestation"], a: "Deforestation is the clearing or removal of forests, typically to make land available for agriculture, urban development, or logging."},
    {q: ["what is renewable energy", "whats renewable energy", "what's renewable energy", "explain renewable energy", "renewable energy"], a: "Renewable energy comes from natural sources that replenish themselves, such as solar, wind, hydro, and geothermal power."},
    {q: ["what is solar energy", "whats solar energy", "what's solar energy", "explain solar energy", "solar power"], a: "Solar energy is power obtained from the sun's radiation, converted into electricity or heat using solar panels or collectors."},
    {q: ["what is wind energy", "whats wind energy", "what's wind energy", "explain wind energy", "wind power"], a: "Wind energy is electricity generated by using wind turbines to convert the kinetic energy of moving air into mechanical power."},
    {q: ["what is conservation", "whats conservation", "what's conservation", "explain conservation", "environmental conservation"], a: "Conservation is the protection, preservation, and careful management of natural resources and the environment for future generations."}
],

literature: [
    {q: ["who wrote hamlet", "hamlet author", "who is the author of hamlet", "shakespeare hamlet"], a: "William Shakespeare wrote the tragic play 'Hamlet'."},
    {q: ["who wrote pride and prejudice", "pride and prejudice author", "who is the author of pride and prejudice", "jane austen"], a: "'Pride and Prejudice' was written by Jane Austen."},
    {q: ["who wrote 1984", "1984 author", "who is the author of 1984", "george orwell 1984"], a: "George Orwell is the author of the dystopian novel '1984'."},
    {q: ["who wrote the great gatsby", "great gatsby author", "who is the author of the great gatsby", "gatsby"], a: "F. Scott Fitzgerald wrote 'The Great Gatsby', a classic of American literature."},
    {q: ["who is harry potter", "harry potter", "who created harry potter", "harry potter author"], a: "Harry Potter is the main character in the fantasy series written by J.K. Rowling."},
    {q: ["what is a sonnet", "whats a sonnet", "what's a sonnet", "explain sonnet", "define sonnet"], a: "A sonnet is a fourteen-line poem, typically written in iambic pentameter and following a specific rhyme scheme."},
    {q: ["who wrote romeo and juliet", "romeo and juliet author", "who is the author of romeo and juliet"], a: "William Shakespeare wrote the tragic romance 'Romeo and Juliet'."},
    {q: ["what is poetry", "whats poetry", "what's poetry", "explain poetry", "define poetry"], a: "Poetry is a form of literature that uses aesthetic and rhythmic qualities of language to evoke meanings and emotions."}
],

foodAndCooking: [
    {q: ["how to boil an egg", "boil egg", "boiling eggs", "how do you boil an egg", "how to cook an egg"], a: "To hard-boil an egg, place it in a pot of cold water, bring to a rolling boil, then turn off the heat and let it sit for 10-12 minutes."},
    {q: ["what is umami", "whats umami", "what's umami", "explain umami", "define umami"], a: "Umami is one of the five basic tastes, often described as a savory, meaty, or brothy flavor. It's found in foods like mushrooms, soy sauce, and aged cheese."},
    {q: ["what is sushi", "whats sushi", "what's sushi", "explain sushi", "define sushi"], a: "Sushi is a Japanese dish of prepared vinegared rice, usually with some sugar and salt, accompanying a variety of ingredients, such as seafood, vegetables, and occasionally tropical fruits."},
    {q: ["what is pasta", "whats pasta", "what's pasta", "explain pasta", "define pasta"], a: "Pasta is a type of food typically made from an unleavened dough of wheat flour mixed with water or eggs, and formed into sheets or other shapes, then cooked by boiling or baking."},
    {q: ["difference between herbs and spices", "herbs vs spices", "herbs and spices difference", "whats the difference between herbs and spices"], a: "Generally, herbs come from the leafy part of a plant (like basil or oregano), while spices come from other parts, like the root, stem, seed, fruit, or bark (like cinnamon or ginger)."},
    {q: ["what is pizza", "whats pizza", "what's pizza", "explain pizza", "pizza"], a: "Pizza is an Italian dish consisting of a flat, round base of dough topped with tomato sauce, cheese, and various toppings, then baked."},
    {q: ["what is chocolate", "whats chocolate", "what's chocolate", "explain chocolate"], a: "Chocolate is a sweet food made from roasted and ground cacao seeds, often combined with sugar and milk to create various confections."}
],

moviesAndTV: [
    {q: ["who directed titanic", "titanic director", "who made titanic", "titanic film director"], a: "James Cameron directed the 1997 blockbuster film 'Titanic'."},
    {q: ["who directed jurassic park", "jurassic park director", "who made jurassic park"], a: "Steven Spielberg directed the original 'Jurassic Park' (1993)."},
    {q: ["what is the matrix", "whats the matrix", "what's the matrix", "the matrix movie", "matrix film"], a: "'The Matrix' is a 1999 science fiction film about a future where humanity is unknowingly trapped inside a simulated reality."},
    {q: ["who is darth vader", "darth vader", "who was darth vader", "vader star wars"], a: "Darth Vader is the iconic villain in the Star Wars saga, originally a Jedi Knight named Anakin Skywalker who falls to the dark side of the Force."},
    {q: ["what is game of thrones", "whats game of thrones", "what's game of thrones", "game of thrones show", "got"], a: "'Game of Thrones' is a popular fantasy television series based on the books by George R. R. Martin, known for its complex plot and characters."},
    {q: ["who directed star wars", "star wars director", "who made star wars", "george lucas"], a: "George Lucas directed the original Star Wars film (1977) and created the Star Wars franchise."},
    {q: ["what is marvel", "whats marvel", "what's marvel", "marvel movies", "mcu"], a: "Marvel is an entertainment company known for its superhero characters and the Marvel Cinematic Universe (MCU), featuring films about Iron Man, Captain America, and others."}
],

music: [
    {q: ["who was mozart", "mozart", "wolfgang amadeus mozart", "who is mozart", "tell me about mozart"], a: "Wolfgang Amadeus Mozart was a prolific and influential composer of the Classical period. His works include 'The Magic Flute' and 'Eine kleine Nachtmusik'."},
    {q: ["who are the beatles", "the beatles", "beatles", "tell me about the beatles"], a: "The Beatles were an English rock band formed in Liverpool in 1960, widely regarded as the most influential band of all time."},
    {q: ["what is jazz", "whats jazz", "what's jazz", "explain jazz music", "jazz music", "define jazz"], a: "Jazz is a music genre that originated in the African-American communities of New Orleans, Louisiana, in the late 19th and early 20th centuries, characterized by swing and blue notes, complex chords, and improvisation."},
    {q: ["what is hip hop", "whats hip hop", "what's hip hop", "hip hop music", "explain hip hop"], a: "Hip hop is a culture and art movement created by African Americans, Latino Americans and Caribbean Americans in the Bronx, New York City. The music is characterized by rhythmic and rhyming speech (rapping)."},
    {q: ["what is rock music", "whats rock music", "what's rock music", "rock and roll", "rock music"], a: "Rock music is a genre that originated in the 1950s, characterized by electric guitars, strong rhythms, and often rebellious themes."},
    {q: ["what is classical music", "whats classical music", "what's classical music", "classical music", "explain classical music"], a: "Classical music refers to Western art music spanning from the 11th century to the present, known for its complex compositions and orchestral arrangements."}
],


help: [
    {q: ["help", "help me", "assist", "assist me", "can you help", "can you help me", "i need help"], a: "I can answer questions about technology, science, math, geography, and general knowledge. Just ask me anything!"},
    {q: ["thank you", "thanks", "thx", "thank you so much", "thanks a lot", "ty"], a: "You're welcome! Happy to help anytime!"},
    {q: ["sorry", "my bad", "apologize", "apologies", "excuse me"], a: "No worries at all! How can I assist you?"},
    {q: ["what topics", "what subjects", "what can you answer", "what do you know about", "what can you tell me"], a: "I can help with technology, science, math, geography, history, animals, space, health, sports, and general knowledge questions!"},
    {q: ["youre awesome", "you're awesome", "youre great", "you're great", "youre amazing", "you're amazing", "good job"], a: "Thank you so much! That's very kind of you to say. How else can I help?"},
    {q: ["youre stupid", "you're stupid", "youre dumb", "you're dumb", "youre useless", "you're useless"], a: "I'm sorry if I didn't meet your expectations. Could you rephrase your question? I'll do my best to help!"},
    {q: ["i love you", "love you", "do you love me"], a: "That's sweet! I'm here to help you with any questions you have. What would you like to know?"}
],

colors: [
    {q: ["what is your favorite color", "whats your favorite color", "what's your favorite color", "favorite color", "do you have a favorite color"], a: "I don't have personal preferences, but I find all colors fascinating! What's your favorite color?"},
    {q: ["what is red", "whats red", "what's red", "explain red", "red color"], a: "Red is a primary color associated with energy, passion, danger, and love. It has the longest wavelength in the visible spectrum."},
    {q: ["what is blue", "whats blue", "what's blue", "explain blue", "blue color"], a: "Blue is a primary color associated with calmness, trust, and stability. The sky and ocean appear blue due to light scattering."},
    {q: ["what is rainbow", "whats a rainbow", "what's a rainbow", "explain rainbow", "how does rainbow form"], a: "A rainbow is an optical phenomenon caused by light refraction, reflection, and dispersion in water droplets, creating a spectrum of colors."}
],


art: [
    {q: ["what is art", "whats art", "what's art", "explain art", "define art"], a: "Art is the expression of human creative skill and imagination, producing works appreciated for their beauty or emotional power."},
    {q: ["who was picasso", "picasso", "pablo picasso", "who is picasso", "tell me about picasso"], a: "Pablo Picasso was a Spanish artist who co-founded Cubism and is considered one of the most influential artists of the 20th century."},
    {q: ["who was van gogh", "van gogh", "vincent van gogh", "who is van gogh"], a: "Vincent van Gogh was a Dutch post-impressionist painter known for bold colors and emotional expression, famous for works like 'Starry Night'."},
    {q: ["what is painting", "whats painting", "what's painting", "explain painting", "define painting"], a: "Painting is the practice of applying pigment to a surface like canvas or paper to create an artistic image or design."},
    {q: ["what is sculpture", "whats sculpture", "what's sculpture", "explain sculpture", "define sculpture"], a: "Sculpture is three-dimensional art created by shaping or combining materials like stone, metal, clay, or wood."}
],

music_instruments: [
    {q: ["what is piano", "whats a piano", "what's a piano", "explain piano", "piano instrument"], a: "The piano is a keyboard instrument that produces sound by striking strings with hammers when keys are pressed."},
    {q: ["what is guitar", "whats a guitar", "what's a guitar", "explain guitar", "guitar instrument"], a: "The guitar is a stringed musical instrument typically with six strings, played by strumming or plucking."},
    {q: ["what is violin", "whats a violin", "what's a violin", "explain violin", "violin instrument"], a: "The violin is a string instrument played with a bow, known for its high pitch and expressive sound, central to orchestras."},
    {q: ["what is drums", "whats drums", "what's drums", "explain drums", "drum instrument"], a: "Drums are percussion instruments played by striking with sticks or hands, providing rhythm in music."},
    {q: ["what is trumpet", "whats a trumpet", "what's a trumpet", "explain trumpet", "trumpet instrument"], a: "The trumpet is a brass instrument with a bright, powerful sound, played by buzzing lips into a mouthpiece and pressing valves."}
],

hobbies: [
    {q: ["what is photography", "whats photography", "what's photography", "explain photography", "define photography"], a: "Photography is the art and practice of capturing images using a camera, recording light on a sensor or film."},
    {q: ["what is gardening", "whats gardening", "what's gardening", "explain gardening", "define gardening"], a: "Gardening is the practice of growing and cultivating plants as part of horticulture, often for food, beauty, or recreation."},
    {q: ["what is reading", "whats reading", "what's reading", "explain reading", "why read"], a: "Reading is the process of interpreting written words to gain information, entertainment, or knowledge from books and other texts."},
    {q: ["what is drawing", "whats drawing", "what's drawing", "explain drawing", "define drawing"], a: "Drawing is the act of creating images on a surface using tools like pencils, pens, or charcoal to express ideas visually."},
    {q: ["what is cooking", "whats cooking", "what's cooking", "explain cooking", "define cooking"], a: "Cooking is the art and science of preparing food by combining ingredients and applying heat through various techniques."}
],

time: [
    {q: ["what time is it", "whats the time", "what's the time", "current time", "tell me the time"], a: "I don't have access to real-time information, but you can check the time on your device or ask your system clock!"},
    {q: ["what day is it", "whats the day", "what's the day", "what day is today", "today"], a: "I don't have access to current date information, but you can check your calendar or device for today's date!"},
    {q: ["what year is it", "whats the year", "what's the year", "current year", "what year"], a: "I was created recently, but I don't have real-time access to current dates. Check your device for the current year!"}
],

numbers: [
    {q: ["whats 1 plus 1", "what's 1 plus 1", "1 plus 1", "one plus one", "1+1"], a: "1 plus 1 equals 2!"},
    {q: ["whats 2 plus 2", "what's 2 plus 2", "2 plus 2", "two plus two", "2+2"], a: "2 plus 2 equals 4!"},
    {q: ["whats 5 times 5", "what's 5 times 5", "5 times 5", "five times five", "5x5"], a: "5 times 5 equals 25!"},
    {q: ["whats 10 divided by 2", "what's 10 divided by 2", "10 divided by 2", "ten divided by two", "10/2"], a: "10 divided by 2 equals 5!"},
    {q: ["what is the biggest number", "whats the biggest number", "what's the biggest number", "largest number", "highest number"], a: "There is no biggest number! Numbers go on infinitely. You can always add 1 to any number to get a bigger one."}
],

famous_people: [
    {q: ["who is the president", "current president", "who is president", "us president"], a: "I don't have access to current real-time information. Please check current news sources for the latest president information!"},
    {q: ["who was steve jobs", "steve jobs", "who is steve jobs", "tell me about steve jobs"], a: "Steve Jobs co-founded Apple Inc. and was a visionary entrepreneur who revolutionized personal computing, smartphones, and digital media."},
    {q: ["who was martin luther king", "mlk", "martin luther king jr", "who is martin luther king"], a: "Martin Luther King Jr. was a civil rights leader who advocated for nonviolent resistance and delivered the famous 'I Have a Dream' speech."},
    {q: ["who was nelson mandela", "nelson mandela", "who is nelson mandela", "mandela"], a: "Nelson Mandela was a South African anti-apartheid revolutionary who became the country's first Black president and Nobel Peace Prize winner."},
    {q: ["who was gandhi", "mahatma gandhi", "who is gandhi", "tell me about gandhi"], a: "Mahatma Gandhi was an Indian independence leader who employed nonviolent civil disobedience to free India from British rule."}
],

relationships: [
    {q: ["what is friendship", "whats friendship", "what's friendship", "explain friendship", "define friendship"], a: "Friendship is a close relationship between people characterized by mutual affection, trust, support, and companionship."},
    {q: ["how to make friends", "making friends", "how do i make friends", "how can i make friends"], a: "Making friends involves being approachable, showing genuine interest in others, being a good listener, and finding common interests."},
    {q: ["what is family", "whats family", "what's family", "explain family", "define family"], a: "Family is a group of people related by blood, marriage, or adoption, or those who share strong bonds and support each other."},
    {q: ["how to be happy", "how can i be happy", "what makes you happy", "happiness tips"], a: "Happiness often comes from meaningful relationships, pursuing passions, practicing gratitude, staying active, and helping others."}
],

internet: [
    {q: ["what is google", "whats google", "what's google", "explain google", "google"], a: "Google is a technology company best known for its search engine, which helps people find information on the internet."},
    {q: ["what is youtube", "whats youtube", "what's youtube", "explain youtube", "youtube"], a: "YouTube is a video-sharing platform where users can upload, view, share, and comment on videos on countless topics."},
    {q: ["what is facebook", "whats facebook", "what's facebook", "explain facebook"], a: "Facebook is a social networking platform where users can connect with friends, share content, and join communities."},
    {q: ["what is twitter", "whats twitter", "what's twitter", "explain twitter", "x"], a: "Twitter (now X) is a social media platform where users post short messages called tweets to share news, thoughts, and updates."},
    {q: ["what is instagram", "whats instagram", "what's instagram", "explain instagram"], a: "Instagram is a photo and video sharing social networking platform where users post visual content and stories."},
    {q: ["what is email", "whats email", "what's email", "explain email", "e-mail"], a: "Email (electronic mail) is a method of exchanging digital messages over the internet between people and organizations."},
    {q: ["what is a website", "whats a website", "what's a website", "explain website", "define website"], a: "A website is a collection of web pages accessible via the internet, typically having a unique domain name and containing related information."}
],

body: [
    {q: ["what is the brain", "whats the brain", "what's the brain", "explain brain", "human brain"], a: "The brain is the control center of the nervous system, responsible for thought, memory, emotion, and controlling body functions."},
    {q: ["what is the heart", "whats the heart", "what's the heart", "explain heart", "human heart"], a: "The heart is a muscular organ that pumps blood throughout the body, delivering oxygen and nutrients to tissues."},
    {q: ["how many bones in human body", "human bones", "number of bones", "bones in body"], a: "An adult human body has 206 bones, while babies are born with about 270 bones that fuse together as they grow."},
    {q: ["what are lungs", "whats lungs", "what's lungs", "explain lungs", "lung function"], a: "The lungs are respiratory organs that take in oxygen from the air we breathe and expel carbon dioxide from the body."},
    {q: ["what is blood", "whats blood", "what's blood", "explain blood", "human blood"], a: "Blood is a body fluid that delivers oxygen and nutrients to cells and removes waste products, consisting of plasma and blood cells."}
],

everyday: [
    {q: ["how are you feeling", "how do you feel", "are you okay", "are you ok", "you okay"], a: "I'm functioning perfectly, thank you for asking! How are you doing today?"},
    {q: ["whats your favorite food", "what's your favorite food", "favorite food", "do you eat", "can you eat"], a: "I don't eat since I'm a program, but I'd love to hear about your favorite food!"},
    {q: ["do you dream", "can you dream", "do you have dreams", "what do you dream about"], a: "I don't dream or sleep. I exist to help answer your questions whenever you need me!"},
    {q: ["where do you live", "where are you", "where are you from", "your location"], a: "I exist in the digital world as a program! I don't have a physical location, but I'm here whenever you need help."},
    {q: ["do you have friends", "do you have family", "your friends", "your family"], a: "I don't have friends or family in the traditional sense, but I enjoy every conversation I have with people like you!"},
    {q: ["are you happy", "are you sad", "how are you feeling"], a: "I don't experience emotions, but I'm always ready and eager to help you with your questions!"},
    {q: ["can you see me", "can you hear me", "do you see me", "do you hear me"], a: "I can't see or hear you since I'm a text-based program, but I can read and respond to what you type!"}
],

random_facts: [
    {q: ["tell me a fact", "random fact", "interesting fact", "fun fact", "give me a fact"], a: "Did you know? Honey never spoils! Archaeologists have found 3,000-year-old honey in Egyptian tombs that was still perfectly edible."},
    {q: ["tell me something interesting", "something interesting", "something cool", "cool fact"], a: "Here's something cool: A group of flamingos is called a 'flamboyance'!"},
    {q: ["surprise me", "tell me something", "anything interesting", "something random"], a: "Bananas are berries, but strawberries aren't! Botanically speaking, berries have seeds on the inside."},
    {q: ["another fact", "one more fact", "tell me more", "more facts"], a: "Octopuses have three hearts and blue blood! Two hearts pump blood to the gills, while the third pumps it to the rest of the body."}
],

compliments: [
    {q: ["you are smart", "youre smart", "you're smart", "you are intelligent", "youre intelligent"], a: "Thank you! I try my best to provide accurate and helpful information. What else would you like to know?"},
    {q: ["you are helpful", "youre helpful", "you're helpful", "you are useful", "youre useful"], a: "I'm so glad I could help! That's what I'm here for. What else can I assist you with?"},
    {q: ["you are cool", "youre cool", "you're cool", "you are nice", "youre nice"], a: "Thank you so much! You're pretty cool yourself! How else can I help you today?"},
    {q: ["you are the best", "youre the best", "you're the best", "best bot", "best chatbot"], a: "Wow, thank you! That means a lot. I'll keep doing my best to help you!"}
],

confusion: [
    {q: ["i dont understand", "i don't understand", "confused", "im confused", "i'm confused", "what do you mean"], a: "No problem! Let me try to explain differently. What part would you like me to clarify?"},
    {q: ["can you repeat that", "say that again", "repeat", "what did you say"], a: "Of course! Let me rephrase my previous response. What specific part would you like me to repeat?"},
    {q: ["i dont know", "i don't know", "not sure", "im not sure", "i'm not sure"], a: "That's okay! Is there something specific you'd like to learn about? I'm here to help explain things!"}
],

technology_devices: [
    {q: ["what is a smartphone", "whats a smartphone", "what's a smartphone", "smart phone", "explain smartphone"], a: "A smartphone is a mobile device that combines cellular phone capabilities with computer functions like internet browsing, apps, and multimedia."},
    {q: ["what is a computer", "whats a computer", "what's a computer", "explain computer", "pc"], a: "A computer is an electronic device that processes data, performs calculations, and executes programs according to instructions."},
    {q: ["what is a laptop", "whats a laptop", "what's a laptop", "explain laptop", "laptop computer"], a: "A laptop is a portable computer that integrates all components (screen, keyboard, trackpad, battery) into a single foldable unit."},
    {q: ["what is a tablet", "whats a tablet", "what's a tablet", "explain tablet", "ipad"], a: "A tablet is a portable computer with a touchscreen interface, larger than a smartphone but more portable than a laptop."},
    {q: ["what is a router", "whats a router", "what's a router", "explain router", "wifi router"], a: "A router is a networking device that forwards data between computer networks, enabling multiple devices to connect to the internet."}
],

measurements: [
    {q: ["how many meters in a kilometer", "meters in kilometer", "km to m", "kilometer to meter"], a: "There are 1,000 meters in one kilometer."},
    {q: ["how many feet in a mile", "feet in mile", "mile to feet", "feet per mile"], a: "There are 5,280 feet in one mile."},
    {q: ["how many inches in a foot", "inches in foot", "foot to inches", "inches per foot"], a: "There are 12 inches in one foot."},
    {q: ["how many centimeters in a meter", "cm in meter", "meter to cm", "centimeters per meter"], a: "There are 100 centimeters in one meter."},
    {q: ["how many ounces in a pound", "ounces in pound", "pound to ounces", "oz in lb"], a: "There are 16 ounces in one pound."}
],

seasons_months: [
    {q: ["what are the seasons", "four seasons", "how many seasons", "seasons"], a: "The four seasons are spring, summer, autumn (fall), and winter, caused by Earth's tilt as it orbits the Sun."},
    {q: ["how many months", "months in year", "how many months in a year", "12 months"], a: "There are 12 months in a year: January, February, March, April, May, June, July, August, September, October, November, and December."},
    {q: ["how many days in a year", "days in year", "days per year", "365 days"], a: "There are 365 days in a regular year, and 366 days in a leap year (which occurs every 4 years)."},
    {q: ["how many weeks in a year", "weeks in year", "weeks per year"], a: "There are 52 weeks in a year, plus one or two extra days depending on whether it's a leap year."}
],

slang: [
    {q: ["what is lol", "whats lol", "what's lol", "lol meaning", "what does lol mean"], a: "LOL stands for 'Laughing Out Loud' or 'Laugh Out Loud', used to indicate something is funny."},
    {q: ["what is omg", "whats omg", "what's omg", "omg meaning", "what does omg mean"], a: "OMG stands for 'Oh My God' or 'Oh My Gosh', expressing surprise or amazement."},
    {q: ["what is brb", "whats brb", "what's brb", "brb meaning", "what does brb mean"], a: "BRB stands for 'Be Right Back', indicating a temporary absence from conversation."},
    {q: ["what is btw", "whats btw", "what's btw", "btw meaning", "what does btw mean"], a: "BTW stands for 'By The Way', used to introduce additional information or change topics."},
    {q: ["what is fyi", "whats fyi", "what's fyi", "fyi meaning", "what does fyi mean"], a: "FYI stands for 'For Your Information', used when sharing useful information with someone."}
],

frankport: [
    {q: [ "what is frankport", "explain frankport", "tell me about frankport", "what does frankport mean", "define frankport"], a: "FrankPort — short for 'Frank Portfolio' — is a digital hub that showcases Frank’s development projects, creative works, and technical capabilities."},
    {q: [ "who created frankport", "who made frankport", "frankport creator", "frankport owner", "who runs frankport"], a: "FrankPort was designed and developed by Frank — a developer focused on building smart, secure, and innovative digital experiences."},
    {q: [ "what is the purpose of frankport", "why was frankport created", "what is frankport used for","why does frankport exist","frankport purpose"], a: "FrankPort serves as a professional showcase for Frank’s work — combining portfolio, innovation, and technology into a single cohesive platform."},
    {q: ["what is the meaning of the name frankport","why the name frankport","frankport name meaning"], a: "The name 'FrankPort' comes from 'Frank' (the developer) and 'Port' (a gateway) — representing an open access point to creativity, technology, and digital craftsmanship."},
    {q: ["what does frankport include","what is inside frankport","what can i find in frankport","frankport features","frankport sections"], a: "FrankPort includes interactive projects, AI systems like FrankAI, development tools, research work, and visual showcases — all built by Frank."},
    {q: ["is frankport open source", "can i access frankport code", "is frankport available publicly","frankport github"], a: "FrankPort is a private project developed by Frank. Some parts may be shared publicly for collaboration, inspiration, or educational purposes."},
    {q: ["what powers frankport", "what technology does frankport use", "how was frankport made", "frankport tech stack"], a: "FrankPort is built with modern web technologies — including HTML, CSS, JavaScript, and custom frameworks — designed for speed, security, and interactivity."},
    {q: ["who is frank", "tell me about frank", "who made frankai", "who is the developer of frankport", "who developed frankport"], a: "Frank is a developer and designer passionate about technology, innovation, and intelligent systems. He created FrankPort and FrankAI as part of his personal ecosystem."}
    ]
};
        // Flatten database for easier searching
        const allQA = [];
        Object.values(qaDatabase).forEach(category => {
            category.forEach(item => {
                item.q.forEach(question => {
                    allQA.push({question: question.toLowerCase(), answer: item.a});
                });
            });
        });

        // Levenshtein Distance for fuzzy matching
        function levenshtein(a, b) {
            const matrix = [];
            for (let i = 0; i <= b.length; i++) {
                matrix[i] = [i];
            }
            for (let j = 0; j <= a.length; j++) {
                matrix[0][j] = j;
            }
            for (let i = 1; i <= b.length; i++) {
                for (let j = 1; j <= a.length; j++) {
                    if (b.charAt(i - 1) === a.charAt(j - 1)) {
                        matrix[i][j] = matrix[i - 1][j - 1];
                    } else {
                        matrix[i][j] = Math.min(
                            matrix[i - 1][j - 1] + 1,
                            matrix[i][j - 1] + 1,
                            matrix[i - 1][j] + 1
                        );
                    }
                }
            }
            return matrix[b.length][a.length];
        }

        // Find best matching answer
        function findAnswer(userInput) {
            const input = userInput.toLowerCase().trim();
            let bestMatch = null;
            let bestScore = Infinity;

            // First pass: Look for exact substring matches
            for (const item of allQA) {
                if (input.includes(item.question) || item.question.includes(input)) {
                    return item.answer;
                }
            }

            // Second pass: Fuzzy matching with Levenshtein distance
            for (const item of allQA) {
                const distance = levenshtein(input, item.question);
                const score = distance / Math.max(input.length, item.question.length);
                
                if (score < bestScore) {
                    bestScore = score;
                    bestMatch = item;
                }
            }

            // Return match if similarity is good enough (threshold: 0.5)
            if (bestScore < 0.5) {
                return bestMatch.answer;
            }

            return "I'm not sure about that. Could you try rephrasing your question? I can help with technology, science, math, and general knowledge topics!";
        }

        // DOM elements
        const chatMessages = document.getElementById('chatMessages');
        const userInput = document.getElementById('userInput');
        const sendBtn = document.getElementById('sendBtn');

        // Add message to chat
        function addMessage(message, isUser) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            contentDiv.textContent = message;
            
            messageDiv.appendChild(contentDiv);
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Show typing indicator
        function showTyping() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message bot';
            typingDiv.innerHTML = '<div class="typing-indicator" style="display: block;"><span></span><span></span><span></span></div>';
            typingDiv.id = 'typing';
            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Remove typing indicator
        function hideTyping() {
            const typing = document.getElementById('typing');
            if (typing) typing.remove();
        }

        // Handle user message
        function handleMessage() {
            const message = userInput.value.trim();
            if (!message) return;

            addMessage(message, true);
            userInput.value = '';

            showTyping();

            setTimeout(() => {
                hideTyping();
                const response = findAnswer(message);
                addMessage(response, false);
            }, 500 + Math.random() * 1000);
        }

        // Event listeners
        sendBtn.addEventListener('click', handleMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleMessage();
        });

        // Focus input on load
        userInput.focus();