const modalInstances = [];

export function addToModalInstances(selfAPI) {
    modalInstances.push(selfAPI);
}

export const modalService = {
    open: (content) => {
        modalInstances[0].open(content)
    },
    openError: (errorMSG, content) => {
        modalInstances[0].open(content, errorMSG)
    },
    title(title: any) {
        return {
            open: (content) => {
                modalInstances[0].open(content, null, title)
            }
        }
    },
    close: () => modalInstances[0].close()
};
