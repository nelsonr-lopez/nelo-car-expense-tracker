{-# LANGUAGE OverloadedStrings #-}

module Processor.Services.RabbitMQ
  ( startConsumer
  ) where

import qualified Processor.Config as Config
import qualified Processor.Models.Expense as Expense
import Network.AMQP
import Data.Aeson
import Control.Monad.IO.Class
import Control.Monad.Logger
import qualified Data.Text.Lazy.Encoding as TLE

startConsumer :: Config.Config -> LoggingT IO ()
startConsumer config = do
  conn <- liftIO $ openConnection "localhost" "/" "guest" "guest"
  chan <- liftIO $ openChannel conn
  
  -- Declare the queue
  let qName = Config.rabbitmqQueue config
  _ <- liftIO $ declareQueue chan newQueue {queueName = qName}
  
  -- Set QoS
  liftIO $ qos chan 0 1 False
  
  -- Start consuming
  logInfoN $ "Starting to consume from queue: " <> qName
  
  _ <- liftIO $ consumeMsgs chan qName Ack $ processMessage chan
  
  -- Keep the connection open
  _ <- liftIO $ getLine
  
  -- Cleanup
  liftIO $ closeConnection conn

processMessage :: Channel -> (Message, Envelope) -> IO ()
processMessage _ (msg, env) = do
  let content = msgBody msg
      json = TLE.decodeUtf8 content
  
  case decode (TLE.encodeUtf8 json) :: Maybe Expense.Expense of
    Just expense -> do
      -- Process the expense
      putStrLn $ "Processing expense: " ++ show expense
      -- TODO: Add actual expense processing logic
      
      -- Acknowledge the message
      ackEnv env
      
    Nothing -> do
      putStrLn $ "Failed to parse message: " ++ show json
      -- Reject the message and requeue
      rejectEnv env True 