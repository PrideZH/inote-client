export class StringUtil {

  public static isEmpty(str: string): boolean {
    return str.trim() === '';
  }

  public static isBlank(str: string | null): boolean {
    return str === null || str.trim() === '';
  }

  public static isOrBlank(...strs: (string | null)[]): boolean {
    if (strs.length === 0) {
      return true;
    }
    for (let i = 0; i < strs.length; i++) {
      if (strs[i] === null || strs[i]?.trim() === '') {
        return true;
      }
    }
    return false;
  }

  public static isAndBlank(...strs: (string | null)[]): boolean {
    if (strs.length === 0) {
      return true;
    }
    for (let i = 0; i < strs.length; i++) {
      if (strs[i] !== null && strs[i]?.trim() !== '') {
        return false;
      }
    }
    return true;
  }

  public static filterSpecialChar(str: string): string {
    return str.replace(/[^a-zA-Z0-9\u4E00-\u9FA5!@#$%^&*_.]/g, '');
  }

}
