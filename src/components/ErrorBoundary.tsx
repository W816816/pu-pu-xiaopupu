import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public props: Props;
  state: State = {
    hasError: false,
    error: null
  };

  constructor(props: Props) {
    super(props);
    this.props = props;
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = '应用程序遇到了一个意外错误。';
      try {
        const parsedError = JSON.parse(this.state.error?.message || '{}');
        if (parsedError.error && parsedError.error.includes('Missing or insufficient permissions')) {
          errorMessage = '权限不足，无法访问数据库。请检查您的登录状态或配置。';
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center space-y-6">
          <div className="atmosphere" />
          <div className="glass-panel p-12 max-w-md w-full space-y-6 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mx-auto">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-serif font-light">出错了</h2>
            <p className="text-sm text-white/40 leading-relaxed">{errorMessage}</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-white/5 border border-white/10 rounded-full text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-silky"
            >
              <RotateCcw size={14} />
              <span>重试</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
