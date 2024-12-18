let navbarButtonIds = [];
let navbarDrawerChildrenIds = [];
let navbarButtonToDrawerClassMap = {};

fetch('/jtdash/assets/data/navbar_button_mappings.json')
    .then(response => response.json())
    .then(data => {
        const mappings = data;
        // console.log('Navbar mappings:', mappings);
        // Create the button to drawer class map using Object.fromEntries
        navbarButtonToDrawerClassMap = Object.fromEntries(
            mappings.map(mapping => {
                // noinspection JSUnresolvedReference
                return [mapping.button_id, mapping.panel_id];
            })
        );
        // noinspection JSUnresolvedReference
        navbarButtonIds = mappings.map(mapping => mapping.button_id);
        // noinspection JSUnresolvedReference
        navbarDrawerChildrenIds = mappings.map(mapping => mapping.panel_id);
    })
    .catch(error => {
        console.error('Error loading navbar mappings:', error);
    });

// const navbarButtonToDrawerClassMap = Object.fromEntries(
//     navbarButtonIds.map((buttonId, index) => {
//         return [buttonId, navbarDrawerChildrenIds[index]];
//     })
// );


const activeNavbarButtonClass = "navbar-button-active";
const activeNavbarDrawerClasses = ["animate__animated", "animate__slideInUp"];
const navbarDrawerClosedClass = "animate__slideOutLeft";
const navbarDrawerOpenedClass = "animate__slideInLeft";

const isMobile = () => window.innerWidth <= 768;

const isClickedButtonActive = (clickedButton) =>
    clickedButton.classList.contains(activeNavbarButtonClass);

const handleInitialState = () => {
    const chartsButton = document.querySelector(`#${navbarButtonIds[0]}`);
    chartsButton.classList.toggle(activeNavbarButtonClass);

    const defaultNavbarChild = document.querySelector(
        `#${navbarDrawerChildrenIds[0]}`
    );
    defaultNavbarChild.classList.add(...activeNavbarDrawerClasses);

    const navbarDrawer = document.querySelector("#navbar-drawer");
    navbarDrawer.classList.add("animate__animated", navbarDrawerOpenedClass);
};

const handleNavbarButtonClassUpdate = (clickedButtonId) => {
    const clickedButton = document.querySelector(`#${clickedButtonId}`);
    const otherButtons = navbarButtonIds
        .filter((buttonId) => buttonId !== clickedButtonId)
        .map((buttonId) => document.querySelector(`#${buttonId}`));

    const navbarDrawer = document.querySelector("#navbar-drawer");

    if (isMobile()) {
        if (isClickedButtonActive(clickedButton)) {
            navbarDrawer.classList.replace(
                navbarDrawerOpenedClass,
                navbarDrawerClosedClass
            );
        } else {
            navbarDrawer.classList.replace(
                navbarDrawerClosedClass,
                navbarDrawerOpenedClass
            );
        }
    }

    if (!isMobile()) {
        if (navbarDrawer.classList.contains(navbarDrawerClosedClass)) {
            navbarDrawer.classList.replace(
                navbarDrawerClosedClass,
                navbarDrawerOpenedClass
            );
        }
    }

    otherButtons.forEach((button) =>
        button.classList.remove(activeNavbarButtonClass)
    );

    clickedButton.classList.toggle(activeNavbarButtonClass);
};

const handleNavbarDrawerClassUpdate = (clickedButtonId) => {
    const activeDrawerElementId = navbarButtonToDrawerClassMap[clickedButtonId];
    const activeDrawerElement = document.querySelector(
        `#${activeDrawerElementId}`
    );

    const otherDrawerElements = navbarDrawerChildrenIds
        .filter((id) => id !== activeDrawerElementId)
        .map((drawerElementId) => document.querySelector(`#${drawerElementId}`));

    otherDrawerElements.forEach((drawerElement) =>
        drawerElement.classList.add("hidden")
    );
    activeDrawerElement.classList.remove("hidden");
    activeDrawerElement.classList.add(...activeNavbarDrawerClasses);
};

const handleCollapseButtonClick = (collapseButtonId) => {
    const navbarDrawer = document.querySelector("#navbar-drawer");
    if (navbarDrawer.classList.contains(navbarDrawerClosedClass)) {
        navbarDrawer.classList.replace(
            navbarDrawerClosedClass,
            navbarDrawerOpenedClass
        );
    } else {
        navbarDrawer.classList.replace(
            navbarDrawerOpenedClass,
            navbarDrawerClosedClass
        );
    }
};
