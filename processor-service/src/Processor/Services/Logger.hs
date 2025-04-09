{-# LANGUAGE OverloadedStrings #-}

module Processor.Services.Logger
  ( initializeLogger
  , runAppLogging
  ) where

import qualified Processor.Config as Config
import Control.Monad.Logger
import Control.Monad.IO.Class
import Data.Text (Text)
import qualified Data.Text as T

initializeLogger :: Config.Config -> LoggingT IO ()
initializeLogger config = do
  logInfoN "Logger initialized"

runAppLogging :: LoggingT IO a -> IO a
runAppLogging = runStdoutLoggingT 