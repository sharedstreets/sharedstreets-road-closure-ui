export const authHeader = () => {
    const userItem = localStorage.getItem('user');
    if (userItem) {
        const user = JSON.parse(userItem);
        if (user && user.token) {
            return {
                'Authorization': 'Bearer ' + user.token
            };
        }
    }

    return {};
}