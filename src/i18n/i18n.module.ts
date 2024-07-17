import { Module } from '@nestjs/common';
import { I18nModule } from 'nestjs-i18n';
import { AcceptLanguageResolver, I18nJsonLoader } from 'nestjs-i18n';

/**
 * Module for configuring internationalization (i18n) settings.
 *
 * This module sets up the internationalization framework using `nestjs-i18n` to
 * handle translations and language resolution in the application.
 *
 * @module
 */
@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en', // Default language if no other language is specified
      loader: I18nJsonLoader, // Loader to load translation files in JSON format
      loaderOptions: {
        path: 'src/i18n', // Path to the directory containing translation files
        watch: true, // Watch for changes in translation files and reload them
      },
      resolvers: [AcceptLanguageResolver], // Resolver to determine the language based on the 'Accept-Language' header
    }),
  ],
  exports: [I18nModule], // Exporting I18nModule to make it available in other modules
})
export class I18nConfigModule {}
