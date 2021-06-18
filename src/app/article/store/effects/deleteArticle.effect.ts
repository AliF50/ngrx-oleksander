import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs';

import {ArticleService} from '../../services/article.service';
import {
  deleteArticleSuccessAction,
  deleteArticleFailureAction,
  deleteArticleAction,
} from '../actions/deleteArticle.action';

@Injectable()
export class DeleteArticleEffect {
  deleteArticle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteArticleAction),
      switchMap(({slug}) => {
        return this.articleService.deleteArticle(slug).pipe(
          map(() => {
            return deleteArticleSuccessAction();
          }),
          catchError(() => {
            return of(deleteArticleFailureAction());
          })
        );
      })
    )
  );

  redirectAfterDelete$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteArticleSuccessAction),
        tap(() => {
          this.router.navigate(['/']);
        })
      ),
    {dispatch: false}
  );

  constructor(
    private actions$: Actions,
    private articleService: ArticleService,
    private router: Router
  ) {}
}
