--[[
	TurtleData - Database Loader and Lookup Functions
	Loads items-turtle.lua and units-turtle.lua
	Provides query functions for item and NPC information
]]

-- Create database namespace
TurtleData.DB = {}

-- Raw database tables (populated on load)
local items_db = {}
local units_db = {}
local db_loaded = false

--[[
	LoadDatabase()
	Initializes database by caching references to pfDB tables
	Called on addon initialization
	
	Note: Database files are loaded by WoW via .toc listing,
	they populate the pfDB["items"]["data-turtle"] and 
	pfDB["units"]["data-turtle"] tables automatically
]]
function TurtleData.DB:LoadDatabase()
	if db_loaded then
		TurtleData:Print("Database already loaded")
		return true
	end

	-- Database files are automatically loaded by WoW via .toc
	-- They populate pfDB["items"]["data-turtle"] and pfDB["units"]["data-turtle"]
	
	-- Initialize pfDB structure if it doesn't exist
	_G.pfDB = _G.pfDB or {}
	_G.pfDB["items"] = _G.pfDB["items"] or {}
	_G.pfDB["units"] = _G.pfDB["units"] or {}

	-- Cache references to the turtle data
	items_db = pfDB["items"]["data-turtle"] or {}
	units_db = pfDB["units"]["data-turtle"] or {}

	db_loaded = true

	-- Verify data was loaded
	if next(items_db) and next(units_db) then
		local itemCount = 0
		local unitCount = 0
		for _ in pairs(items_db) do itemCount = itemCount + 1 end
		for _ in pairs(units_db) do unitCount = unitCount + 1 end
		TurtleData:Print("|cff6bff6b[✓]|r Database loaded: " .. itemCount .. " items, " .. unitCount .. " units")
		return true
	else
		TurtleData:Print("|cffff6b6b[Error]|r Database not found. Check if db files are listed in .toc")
		return false
	end
end

--[[
	GetItemDrops(itemID)
	Returns: {
		drops = { {npcID, dropRate}, {npcID, dropRate}, ... },
		quests = { questID, questID, ... }
	}
	
	Searches items_db for which NPCs drop the item
	and which quests have it as an objective
]]
function TurtleData.DB:GetItemDrops(itemID)
	if not db_loaded then
		return nil
	end

	local result = {
		drops = {},
		quests = {},
		quest_rewards = {}
	}

	-- Search through all NPCs in items database
	for npcID, npc_data in pairs(items_db) do
		if type(npc_data) == "table" then
			-- "U" = Usage/Drops from this NPC
			if npc_data["U"] and npc_data["U"][itemID] then
				table.insert(result.drops, {
					npcID = npcID,
					dropRate = npc_data["U"][itemID],
					npcInfo = self:GetNPCInfo(npcID)
				})
			end

			-- "O" = Objective/Quest reward with this item
			if npc_data["O"] and npc_data["O"][itemID] then
				table.insert(result.quest_rewards, {
					npcID = npcID,
					questID = itemID  -- In items DB, O maps to quest
				})
			end

			-- "R" = Reward items from NPC
			if npc_data["R"] and npc_data["R"][itemID] then
				table.insert(result.quest_rewards, {
					npcID = npcID,
					questID = itemID,
					type = "reward"
				})
			end
		end
	end

	return result
end

--[[
	GetNPCInfo(npcID)
	Returns: {
		npcID = npcID,
		coords = { {x%, y%, mapID, respawnTime}, ... },
		level = "level string",
		faction = "A" | "H" | "AH",  -- Alliance, Horde, Auction House
		rank = "rank"
	}
	
	Retrieves NPC information from units database
]]
function TurtleData.DB:GetNPCInfo(npcID)
	if not db_loaded or not units_db[npcID] then
		return nil
	end

	local npc = units_db[npcID]
	return {
		npcID = npcID,
		coords = npc["coords"] or {},
		level = npc["lvl"],
		faction = npc["fac"],
		rank = npc["rnk"]
	}
end

--[[
	GetNPCDrops(npcID)
	Returns: {
		{itemID, dropRate, type}, ...
	}
	
	Returns all items an NPC drops or offers
]]
function TurtleData.DB:GetNPCDrops(npcID)
	if not db_loaded or not items_db[npcID] then
		return {}
	end

	local npc_items = items_db[npcID]
	local drops = {}

	-- Collect all item types
	for itemType, items in pairs(npc_items) do
		if type(items) == "table" and itemType ~= "coords" then
			for itemID, rate in pairs(items) do
				table.insert(drops, {
					itemID = itemID,
					rate = rate,
					type = itemType  -- "U", "O", "R", "V"
				})
			end
		end
	end

	return drops
end

--[[
	SearchItemsByName(searchTerm)
	Returns: { itemID, itemID, ... }
	
	Note: This requires a name database which we'll add later
	For now, returns empty (placeholder for future)
]]
function TurtleData.DB:SearchItemsByName(searchTerm)
	-- TODO: Implement once we have items-names database
	-- This would search item names instead of IDs
	return {}
end

--[[
	IsLoaded()
	Returns true if database is loaded
]]
function TurtleData.DB:IsLoaded()
	return db_loaded
end

--[[
	GetStats()
	Returns database statistics for debugging
]]
function TurtleData.DB:GetStats()
	return {
		itemsCount = (next(items_db) ~= nil) and #items_db or 0,
		unitsCount = (next(units_db) ~= nil) and #units_db or 0,
		loaded = db_loaded
	}
end
