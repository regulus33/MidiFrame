////////////////////////////////////////////////////////////////
// There will always be only one form, make sure of that one //
////////////////////////////////////////////////////////////////
export const showLoaderWhenSubmitForm = (formElement) => {
    //find the main content of the page and hide it, then display the loading bar which is always hidden in the main app
    formElement.addEventListener("submit", (event) => {
        formElement.style = {"display":"none"}
        document.getElementById("page_content").className = "hidden"
        document.getElementById("loading_bar").className = "visible"
    });
}


export const example = (d) => {""}