-- TurtleData - Main
-- Event handling and slash commands

local TD = _G.TurtleData
local ADDON_NAME = "TurtleData"

local frame = CreateFrame("Frame")
frame:RegisterEvent("ADDON_LOADED")
frame:RegisterEvent("PLAYER_LOGIN")

-- Register slash commands immediately (before events)
SLASH_TURTLEDATA1 = "/tdata"
SlashCmdList["TURTLEDATA"] = function(msg)
    -- Ensure TD exists
    if not _G.TurtleData then
        DEFAULT_CHAT_FRAME:AddMessage("TurtleData not loaded yet!")
        return
    end
    
    local TD = _G.TurtleData
    msg = (msg or ""):lower()
    local cmd = msg:match("^(%S+)") or ""

    if cmd == "help" or cmd == "" then
        TD:Print("Commands:")
        TD:Print("  /tdata help     - show help")
        TD:Print("  /tdata ping     - test output")
        TD:Print("  /tdata ver      - show version")
        TD:Print("  /tdata db       - show database stats")
        TD:Print("  /tdata item <id> - lookup item drops")
        TD:Print("  /tdata npc <id>  - lookup NPC info")
    elseif cmd == "ping" then
        TD:Print("pong")
    elseif cmd == "ver" or cmd == "version" then
        TD:Print("version " .. TD.VERSION)
    elseif cmd == "db" then
        if TD.DB and TD.DB:IsLoaded() then
            local stats = TD.DB:GetStats()
            TD:Print("|cff6bff6bDatabase Status:|r")
            TD:Print("  Loaded: " .. (stats.loaded and "Yes" or "No"))
            TD:Print("  Items: " .. stats.itemsCount)
            TD:Print("  Units: " .. stats.unitsCount)
        else
            TD:Print("|cffff6b6b[Error]|r Database not loaded")
        end
    elseif cmd == "item" then
        local itemID = tonumber(msg:match("^%S+%s+(%d+)"))
        if not itemID then
            TD:Print("Usage: /tdata item <itemID>")
            TD:Print("Example: /tdata item 12345")
            return
        end
        
        if not TD.DB or not TD.DB:IsLoaded() then
            TD:Print("|cffff6b6b[Error]|r Database not loaded")
            return
        end
        
        local drops = TD.DB:GetItemDrops(itemID)
        if drops and #drops.drops > 0 then
            TD:Print("|cff00ff7fItem " .. itemID .. " drops:|r")
            for i, drop in ipairs(drops.drops) do
                if i <= 5 then  -- Show max 5
                    local npcInfo = drop.npcInfo or {}
                    local level = npcInfo.level or "?"
                    local rate = drop.dropRate or 0
                    TD:Print("  NPC " .. drop.npcID .. " (Lvl " .. level .. ") - " .. (rate * 100) .. "%")
                end
            end
            if #drops.drops > 5 then
                TD:Print("  ... and " .. (#drops.drops - 5) .. " more")
            end
        else
            TD:Print("No drop data found for item " .. itemID)
        end
    elseif cmd == "npc" then
        local npcID = tonumber(msg:match("^%S+%s+(%d+)"))
        if not npcID then
            TD:Print("Usage: /tdata npc <npcID>")
            TD:Print("Example: /tdata npc 1234")
            return
        end
        
        if not TD.DB or not TD.DB:IsLoaded() then
            TD:Print("|cffff6b6b[Error]|r Database not loaded")
            return
        end
        
        local npcInfo = TD.DB:GetNPCInfo(npcID)
        if npcInfo then
            TD:Print("|cff00ff7fNPC " .. npcID .. " info:|r")
            TD:Print("  Level: " .. (npcInfo.level or "?"))
            TD:Print("  Faction: " .. (npcInfo.faction or "neutral"))
            TD:Print("  Locations: " .. #npcInfo.coords)
            
            local drops = TD.DB:GetNPCDrops(npcID)
            if #drops > 0 then
                TD:Print("  Drops " .. #drops .. " items")
            end
        else
            TD:Print("No info found for NPC " .. npcID)
        end
    else
        TD:Print("unknown command; try /tdata help")
    end
end

function frame:OnEvent(event, ...)
    if event == "ADDON_LOADED" then
        local name = ...
        if name == ADDON_NAME then
            TD:Initialize()
            -- Confirm slash command is registered
            DEFAULT_CHAT_FRAME:AddMessage("|cff00ff7fTurtleData|r: Slash command /tdata registered")
        end
    elseif event == "PLAYER_LOGIN" then
        TD:Print("Hello Turtle WoW! Use /tdata help")
    end
end

frame:SetScript("OnEvent", frame.OnEvent)

return TD
