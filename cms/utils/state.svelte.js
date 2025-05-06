// Authentication state - using $state for reactivity
export const authState = $state({
    isAuthenticated: false,
    isLoading: false,
    errorMessage: '',
    user: { login: null },
    repositories: [],
    organizations: [],
})
