# UUE Project API Reference

Version: 1.2.0-rc.1

## mountUUE(container, options)

Returns a Promise resolving to a project client.

Required options:

- id: unique project identifier
- engineUrl: same-origin engine URL
- authorize: synchronous decision validator

Recommended options:

- engineVersion: exact expected engine version
- session: unique experiment/session identifier
- initialCity: compatible exported city snapshot
- onDecision: accepted-decision callback
- onRejected: rejected-decision callback

## Read operations

    engine.getState()
    engine.getObject(id)
    engine.getInventory()
    engine.exportCity()

These return copies of engine data.

## Mutation operations

    engine.execute(action, ...args)

Supported commands:

    place(type,x,z,vertical,length)
    edit(id,changes)
    duplicate(id,x,z)
    demolish(id)
    upgrade(id)
    drawRoad(start,end,width,control,bridge)
    widenRoad(id,width)
    landscapeBrush(tool,x,z,radius)
    groupEdit(ids,action,dx,dz)
    expand()
    undo()
    redo()

Result:

    {ok:true,error:null}

or:

    {ok:false,error:'Reason'}

Restore a compatible exported city:

    engine.importCity(save)

This throws on rejected or invalid saves.

Remove the engine instance:

    engine.dispose()

## Events

onDecision receives an object containing:

    action
    args
    state
    identity

This represents successful model mutation,
not confirmation of completed rendering.

onRejected receives:

    action
    args
    reason

## Example validator

    authorize({action,args,state}) {
      if(action === 'place') {
        if(args[0] === 'hospital') {
          return 'Hospital construction disabled';
        }
      }
      return true;
    }

## Policy notes

Direct editor interactions and API commands
pass through the same model policy.

Undo and redo are separate decisions. Research
projects must explicitly reconcile their effects
with project-specific state.

Restore operations are validated separately.

Do not call new editing commands recursively
from decision validators or callbacks.

A validator returning a Promise is not supported.
