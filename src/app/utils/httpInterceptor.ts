interface FetchInterceptorOptions {
  onUnauthorized?: () => void;
  onForbidden?: () => void;
}

class HttpInterceptor {
  private static instance: HttpInterceptor;
  private options: FetchInterceptorOptions = {};

  private constructor() {
    this.setupInterceptor();
  }

  public static getInstance(): HttpInterceptor {
    if (!HttpInterceptor.instance) {
      HttpInterceptor.instance = new HttpInterceptor();
    }
    return HttpInterceptor.instance;
  }

  public configure(options: FetchInterceptorOptions) {
    this.options = { ...this.options, ...options };
  }

  private setupInterceptor() {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);

        if (response.status === 401) {
          this.handleUnauthorized();
        } else if (response.status === 403) {
          this.handleForbidden();
        }

        return response;
      } catch (error) {
        throw error;
      }
    };
  }

  private handleUnauthorized() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    if (this.options.onUnauthorized) {
      this.options.onUnauthorized();
    } else {
      window.location.href = '/login';
    }
  }

  private handleForbidden() {
    if (this.options.onForbidden) {
      this.options.onForbidden();
    }
  }
}

export default HttpInterceptor;