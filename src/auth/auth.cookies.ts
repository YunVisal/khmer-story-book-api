import express from 'express';
import { REFRESH_TOKEN_COOKIE_KEY } from 'src/app.config';

const REFRESH_TOKEN_COOKIE_OPTIONS: express.CookieOptions = {
  httpOnly: true,
};

export function setRefreshTokenCookie(
  response: express.Response,
  token: string,
) {
  response.cookie(
    REFRESH_TOKEN_COOKIE_KEY,
    token,
    REFRESH_TOKEN_COOKIE_OPTIONS,
  );
}

export function clearRefreshTokenCookie(response: express.Response) {
  response.clearCookie(REFRESH_TOKEN_COOKIE_KEY);
}
