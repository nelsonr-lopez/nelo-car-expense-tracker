{-# LANGUAGE DeriveGeneric #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE RecordWildCards #-}
{-# LANGUAGE ScopedTypeVariables #-}

module Processor.Config where

import Data.Aeson
import Data.Text (Text)
import GHC.Generics
import System.Environment (getEnv)
import Control.Exception (catch, SomeException)
import qualified Data.ByteString as BS
import Data.Yaml (decodeFileEither)

data Config = Config
  { rabbitmqUrl :: Text
  , rabbitmqQueue :: Text
  , logLevel :: Text
  } deriving (Show, Generic)

instance FromJSON Config where
  parseJSON = withObject "Config" $ \v -> Config
    <$> v .:? "rabbitmq_url" .!= "amqp://localhost:5672"
    <*> v .:? "rabbitmq_queue" .!= "expense_queue"
    <*> v .:? "log_level" .!= "info"

loadConfig :: IO Config
loadConfig = do
  configPath <- getEnv "CONFIG_PATH" `catch` (\(_ :: SomeException) -> return "config.yaml")
  config <- decodeFileEither configPath
  case config of
    Left err -> error $ "Failed to load config: " ++ show err
    Right cfg -> return cfg 