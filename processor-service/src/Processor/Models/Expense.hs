{-# LANGUAGE DeriveGeneric #-}
{-# LANGUAGE OverloadedStrings #-}

module Processor.Models.Expense
  ( Expense(..)
  ) where

import GHC.Generics
import Data.Aeson
import Data.Text (Text)
import Data.Time (UTCTime)

data Expense = Expense
  { expenseId :: Text
  , amount :: Double
  , description :: Text
  , date :: UTCTime
  , category :: Text
  , userId :: Text
  } deriving (Show, Eq, Generic)

instance FromJSON Expense
instance ToJSON Expense 