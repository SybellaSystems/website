import { SecurityValidator } from './security';

export interface ValidationErrors {
  [key: string]: string;
}

export class FormValidator {
  static validateEmail(email: string): string | null {
    if (!email || !email.trim()) {
      return 'Email is required';
    }
    if (!SecurityValidator.validateEmail(email)) {
      return 'Please enter a valid email address';
    }
    return null;
  }

  static validatePassword(password: string, minLength: number = 6): string | null {
    if (!password || !password.trim()) {
      return 'Password is required';
    }
    if (password.length < minLength) {
      return `Password must be at least ${minLength} characters long`;
    }
    return null;
  }

  static validateRequired(value: string, fieldName: string): string | null {
    if (!value || !value.trim()) {
      return `${fieldName} is required`;
    }
    return null;
  }

  static validatePhone(phone: string): string | null {
    if (!phone || !phone.trim()) {
      return null; // Phone is optional
    }
    if (!SecurityValidator.validatePhone(phone)) {
      return 'Please enter a valid phone number';
    }
    return null;
  }

  static validateUrl(url: string, fieldName: string = 'URL'): string | null {
    if (!url || !url.trim()) {
      return null; // URL is optional
    }
    // Allow relative paths (starting with /) for local uploads
    if (url.startsWith('/')) {
      return null; // Relative paths are valid
    }
    if (!SecurityValidator.validateUrl(url)) {
      return `Please enter a valid ${fieldName}`;
    }
    return null;
  }

  static validateYear(year: string | number, fieldName: string = 'Year'): string | null {
    const yearNum = typeof year === 'string' ? parseInt(year, 10) : year;
    if (isNaN(yearNum)) {
      return `${fieldName} must be a valid number`;
    }
    if (yearNum < 1900 || yearNum > 2100) {
      return `${fieldName} must be between 1900 and 2100`;
    }
    return null;
  }

  static validateMinLength(value: string, minLength: number, fieldName: string): string | null {
    if (!value || value.trim().length < minLength) {
      return `${fieldName} must be at least ${minLength} characters long`;
    }
    return null;
  }

  static validateMaxLength(value: string, maxLength: number, fieldName: string): string | null {
    if (value && value.length > maxLength) {
      return `${fieldName} must not exceed ${maxLength} characters`;
    }
    return null;
  }

  static validateImageUrl(url: string): string | null {
    if (!url || !url.trim()) {
      return 'Image is required';
    }
    if (!SecurityValidator.validateUrl(url)) {
      return 'Please enter a valid image URL';
    }
    return null;
  }

  static validateTags(tags: string | string[]): string | null {
    if (!tags) {
      return null; // Tags are optional
    }
    const tagArray = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
    if (tagArray.length === 0) {
      return null;
    }
    if (tagArray.some(tag => tag.length > 50)) {
      return 'Each tag must be less than 50 characters';
    }
    return null;
  }
}

