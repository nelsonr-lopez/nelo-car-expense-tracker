{-# LANGUAGE OverloadedStrings #-}

module Main (main) where

import Control.Monad.Logger
import Processor.Config as Config
import Processor.Services.Logger as Logger
import Processor.Services.RabbitMQ as RabbitMQ

main :: IO ()
main = do
  config <- Config.loadConfig
  runStdoutLoggingT $ do
    _ <- Logger.initializeLogger config
    logInfoN "Starting expense processor service..."
    RabbitMQ.startConsumer config
