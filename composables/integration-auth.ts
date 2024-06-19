
export const useIntegrationAuth = () => {
    const integration = useIntegration();
    const userData = () => {
        if (integration === 'brevia') {
            return useStatesStore().user;
        } else if (integration === 'bedita') {
            return useBeditaAuth().user?.value || null;
        }

        return null;
    }


    const user: Ref<any | null> = ref(userData());

    const isLogged: ComputedRef<boolean> = computed<boolean>(() => user.value !== null);

  const login = async (username: string, password: string) => {
    if (integration === 'brevia') {
        const response = await $fetch('/api/brevia/auth/login', {
            method: 'POST',
            body: {
                username,
                password
            },
        });
        const statesStore = useStatesStore();
        statesStore.userLogin(response);
        user.value = response;

        return response;
    } else if (integration === 'bedita') {
        const data = await useBeditaAuth().login(username, password);
        user.value = filterUserDataToStore(data);
    }
  };

  const logout = async () => {
    if (integration === 'brevia') {
        await $fetch('/api/brevia/auth/logout', {method: 'POST'});
    } else if (integration === 'bedita') {
        await useBeditaAuth().logout();
    }
    const statesStore = useStatesStore();
    statesStore.$reset();
    user.value = null;
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
    user,
    isLogged,
    login,
    logout,
    // resetPassword,
    // changePassword,
    // optOut,
    // updateUser,
  };
}
