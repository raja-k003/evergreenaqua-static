import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom, timeout } from 'rxjs';

export interface Enquiry {
  kind: 'contact' | 'career' | 'question';
  name: string;
  email: string;
  phone: string;
  message: string;
  position?: string;
  /** Honeypot: must stay empty. Bots tend to fill every field. */
  website?: string;
}

export type EnquiryResult = { ok: true } | { ok: false; message: string };

@Injectable({ providedIn: 'root' })
export class EnquiryService {
  private readonly http = inject(HttpClient);

  async send(enquiry: Enquiry): Promise<EnquiryResult> {
    try {
      await firstValueFrom(this.http.post('/api/enquiry', enquiry).pipe(timeout(15000)));
      return { ok: true };
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 429) return { ok: false, message: 'Too many messages in a short time. Please wait a minute and try again.' };
        if (err.status === 400) return { ok: false, message: 'Some details look incorrect. Please check the form and try again.' };
      }
      return { ok: false, message: 'We could not send your message right now. Please try again, or call or WhatsApp us instead.' };
    }
  }
}
