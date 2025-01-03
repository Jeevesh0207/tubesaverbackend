import { Request, Response, NextFunction } from 'express';

import { RequestItag } from '../../types/types';

const verifyItag = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { itag, link }: RequestItag = req.body;
    if (!itag || !link || link.trim() === '') {
      res
        .status(400)
        .json({
          ok: false,
          message: 'itag & link is required and cannot be empty',
        });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Your link or itag is invalid',
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
    });
    return;
  }
};

export default verifyItag;
