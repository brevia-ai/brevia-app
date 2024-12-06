import { type UserAuth } from '@atlasconsulting/nuxt-bedita';

export const useIntegrationAuth = () => {
  const integration = useIntegration();
  const statesStore = useStatesStore();

  const login = async (username: string, password: string, project: string | null = null) => {
    if (integration === 'brevia') {
      const response = await $fetch('/api/brevia/auth/login', {
        method: 'POST',
        body: {
          username,
          password,
          project,
        },
      });
      statesStore.userLogin(response.user);
      statesStore.project = response.project;

      return response;
    } else if (integration === 'bedita') {
      if (project) {
        // setup project API base URL and key in session
        await $fetch('/api/setup_bedita_project', {
          method: 'POST',
          body: { project },
        });
      }
      const response = await useBeditaAuth().login(username, password);
      const user = filterUserDataToStore(response);
      const data = { user, project };
      statesStore.userLogin(user);
      statesStore.project = project;

      return data;
    }
  };

  const logout = async () => {
    if (integration === 'brevia') {
      await $fetch('/api/brevia/auth/logout', { method: 'POST' });
    } else if (integration === 'bedita') {
      await useBeditaAuth().logout();
    }
    statesStore.$reset();
  };

  const resetPassword = async (contact: string) => {
    if (integration !== 'bedita') {
      throw new Error('Unsupported operation in current integration');
    }

    return await useBeditaAuth().resetPassword(contact);
  };

  const changePassword = async (password: string, login = false, uuid?: string) => {
    if (integration !== 'bedita') {
      throw new Error('Unsupported operation in current integration');
    }

    return await useBeditaAuth().changePassword(password, login, uuid);
  };

  const optOut = async (username: string, password: string) => {
    if (integration !== 'bedita') {
      throw new Error('Unsupported operation in current integration');
    }

    const data = await useBeditaAuth().optOut(username, password);
    statesStore.$reset();

    return data;
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
      statesStore.userLogin({ ...userData, ...{ meta } });

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
};
