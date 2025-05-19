import type { UserConfig } from '@commitlint/types' with { 'resolution-mode': 'import' };

const Configuration: UserConfig = {
  extends: ['@commitlint/config-conventional'],
};

export default Configuration;
