import { type UserAuth } from '@atlasconsulting/nuxt-bedita';

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

  const resetPassword = async (contact: string) => {
    if (integration !== 'bedita') {
        throw new Error('Unsupported operation in current integration');
    }
    const recaptcha_token = await useBeditaRecaptcha().executeRecaptcha(RecaptchaActions.RESET_PASSWORD);

    return await $fetch('/api/bedita/auth/reset', {
      method: 'POST',
      body: {
        contact,
        recaptcha_token
      },
    });
  };

  const changePassword = async (password: string, login = false, uuid?: string) => {
    if (integration !== 'bedita') {
        throw new Error('Unsupported operation in current integration');
    }
    const recaptcha_token = await useBeditaRecaptcha().executeRecaptcha(RecaptchaActions.CHANGE_PASSWORD);
    const route = useRoute();

    const data = await $fetch<UserAuth>('/api/bedita/auth/change', {
      method: 'PATCH',
      body: {
        uuid: uuid || route.query?.uuid,
        password,
        login,
        recaptcha_token
      },
    });

    if (login === true) {
        statesStore.userLogin(filterUserDataToStore(data));
    }

    return data;
  };

  const optOut = async (username: string, password: string) => {
    if (integration !== 'bedita') {
        throw new Error('Unsupported operation in current integration');
    }
    const recaptcha_token = await useBeditaRecaptcha().executeRecaptcha(RecaptchaActions.OPTOUT);

    return await $fetch('/api/bedita/auth/optout', {
      method: 'POST',
      body: {
        username,
        password,
        recaptcha_token
      },
    });
  };

  const updateUser = async (body: any) => {
    if (integration !== 'bedita') {
        throw new Error('Unsupported operation in current integration');
    }
    const data = await $fetch<UserAuth>('/api/bedita/auth/user', {
      method: 'PATCH',
      body,
    });

    const userData = filterUserDataToStore(data);
    statesStore.userLogin(userData);

    return userData;
  };

  const userData = async () => {
    if (integration === 'brevia') {
        return statesStore.user;
    } else if (integration === 'bedita') {
        const response = await $fetch('/api/bedita/auth/user');
        const userData = filterUserDataToStore(response);
        const meta = {
            last_login_err: response?.data?.meta?.last_login_err,
            password_modified: response?.data?.meta?.password_modified,
        };
        statesStore.userLogin({...userData, ...{meta}});

        return userData;
    }
  };

  const signup = async (data: any) => {
    if (integration !== 'bedita') {
        throw new Error('Unsupported operation in current integration');
    }

    return useBeditaSignup().signup(data);
  };

  const signupActivation = async () => {
    if (integration !== 'bedita') {
        throw new Error('Unsupported operation in current integration');
    }

    return useBeditaSignup().signupActivation();
  };


  return {
    login,
    logout,
    resetPassword,
    changePassword,
    optOut,
    updateUser,
    userData,
    signup,
    signupActivation,
  };
}
