
export const useIntegrationAuth = () => {
    const integration = useIntegration();
    const statesStore = useStatesStore();

    const login = async (username: string, password: string) => {
        if (integration === 'brevia') {
            const response = await $fetch('/api/brevia/auth/login', {
                method: 'POST',
                body: {
                    username,
                    password
                },
            });
            statesStore.userLogin(response);

            return response;
        } else if (integration === 'bedita') {
            const response = await useBeditaAuth().login(username, password);
            const data = filterUserDataToStore(response);;
            statesStore.userLogin(data);

            return data;
        }
    };

  const logout = async () => {
    if (integration === 'brevia') {
        await $fetch('/api/brevia/auth/logout', {method: 'POST'});
    } else if (integration === 'bedita') {
        await useBeditaAuth().logout();
    }
    statesStore.$reset();
  };

//   const resetPassword = async (contact: string) => {
//     const recaptcha_token = await executeRecaptcha(RecaptchaActions.RESET_PASSWORD);

//     return await $fetch('/api/bedita/auth/reset', {
//       method: 'POST',
//       body: {
//         contact,
//         recaptcha_token
//       },
//     });
//   };

//   const changePassword = async (password: string, login = false, uuid?: string) => {
//     const recaptcha_token = await executeRecaptcha(RecaptchaActions.CHANGE_PASSWORD);
//     const route = useRoute();

//     const data = await $fetch<UserAuth>('/api/bedita/auth/change', {
//       method: 'PATCH',
//       body: {
//         uuid: uuid || route.query?.uuid,
//         password,
//         login,
//         recaptcha_token
//       },
//     });

//     if (login === true) {
//       user.value = filterUserDataToStore(data);
//     }

//     return data;
//   };

//   const optOut = async (username: string, password: string) => {
//     const recaptcha_token = await executeRecaptcha(RecaptchaActions.OPTOUT);

//     return await $fetch('/api/bedita/auth/optout', {
//       method: 'POST',
//       body: {
//         username,
//         password,
//         recaptcha_token
//       },
//     });
//   };

//   const updateUser = async (body: Omit<UserDataStore, 'id' | 'email' | 'username' | 'roles'>) => {
//     const data = await $fetch<UserAuth>('/api/bedita/auth/user', {
//       method: 'PATCH',
//       body,
//     });

//     user.value = filterUserDataToStore(data);

//     return data;
//   };

  return {
    // user,
    // isLogged,
    login,
    logout,
    // resetPassword,
    // changePassword,
    // optOut,
    // updateUser,
  };
}
